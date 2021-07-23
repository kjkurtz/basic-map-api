import { Pool } from 'pg';

let _db: Pool;

export const initDb = async (): Promise<Pool> => {
  if (_db) {
    return _db;
  } else {
    _db = await new Pool({
      user: 'postgres',
      database: 'kylekurtz',
      host: `127.0.0.1`,
    });
    return _db as Pool;
  }
};

export const getDb = (): Pool => {
  return _db as Pool;
};
