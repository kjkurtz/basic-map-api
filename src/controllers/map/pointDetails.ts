import { NextFunction, Request, Response } from 'express';
import { VError } from 'verror';
import { getDb } from '../../lib/db';

const getPointSummary = async (lat: string, lon: string) => {
  const db = getDb();

  try {
    const county = await db.query(`
      SELECT us_county.name AS county_name, namelsad AS county_name_full
      FROM us_county
      WHERE ST_Within(ST_SetSRID(ST_POINT(${lon},${lat}),4326), us_county.geom::geometry)
    `);
    const state = await db.query(`
    SELECT name, stusps
    FROM us_state
    WHERE ST_Within(ST_SetSRID(ST_POINT(${lon},${lat}),4326), geom::geometry)
  `);
    const elevation = await db.query(`
      SELECT contourelevation
      FROM elev_contour
      ORDER BY geom <-> st_setsrid(st_makepoint(${lon},${lat}),4326)
      LIMIT 1;
    `);

    const result = {
      referencePoint: {
        latitude: lat,
        longitude: lon,
      },
      elevation: elevation.rows[0].contourelevation,
      location: {
        county: county.rows[0]?.county_name ?? null,
        countyFull: county.rows[0]?.county_name_full ?? null,
        state: state.rows[0]?.name ?? null,
        stateAbbr: state.rows[0]?.stusps ?? null,
      },
    };
    return result;
  } catch (err) {
    throw new VError(err, 'Error getting point details');
  }
};

export const getSummaryByLatLon = async (
  request: Request,
  response: Response,
  next: NextFunction
): Promise<Response> => {
  const lat: string = request.query.lat as string;
  const lon: string = request.query.lon as string;

  try {
    const result = await getPointSummary(lat, lon);
    response.setHeader('Content-Type', 'application/json');
    return response.json(result);
  } catch (err) {
    next(new VError(err, 'getSummaryByLatLon failed'));
  }
};
