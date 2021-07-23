import sm from '@mapbox/sphericalmercator';
import { NextFunction, Request, Response } from 'express';
import { getDb } from '../../lib/db';

const merc = new sm({
  size: 256,
});

interface MVTRequest extends Request {
  params: {
    x: string;
    y: string;
    z: string;
    table: string;
  };
  query: {
    columns: string[];
  };
}

const sql = (params: MVTRequest['params'], query: MVTRequest['query']) => {
  const bounds = merc.bbox(parseFloat(params.x), parseFloat(params.y), parseFloat(params.z), false, '900913');

  return `
  SELECT
    ST_AsMVT(q, '${params.table}', 4096, 'geom')

  FROM (
    SELECT
      ${query.columns ? `${query.columns},` : ''}
      ST_AsMVTGeom(
        ST_Transform(geom, 3857),
        ST_MakeBox2D(ST_Point(${bounds[0]}, ${bounds[1]}), ST_Point(${bounds[2]}, ${bounds[3]}))
      ) geom

    FROM (
      SELECT
        ${query.columns ? `${query.columns},` : ''}
        geom,
        srid
      FROM
        ${params.table},
        (SELECT ST_SRID(geom) AS srid FROM ${params.table} LIMIT 1) a

      WHERE
        ST_transform(
          ST_MakeEnvelope(${bounds.join()}, 3857),
          srid
        ) &&
        geom
    ) r

  ) q
  `;
};

export const getMvt = async (req: Request, res: Response, next: NextFunction) => {
  const db = getDb();
  try {
    //@ts-ignore
    const mvtResult = await db.query(sql(req.params, req.query));
    const mvt = mvtResult.rows[0].st_asmvt;
    if (mvt.length === 0) {
      return res.sendStatus(204);
    }
    return res.type('application/x-protobuf').send(mvt);
  } catch (error) {
    next(error);
  }
};
