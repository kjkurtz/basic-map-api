import cookieParser from 'cookie-parser';
import cors from 'cors';
import dotenv from 'dotenv';
import express from 'express';
import { getMvt } from './controllers/map/mvt';
import { getSummaryByLatLon } from './controllers/map/pointDetails';
import { initDb } from './lib/db';

const env = process.env.NODE_ENV || 'development';
const PORT = process.env.PORT || 3001;

if (env !== 'production') {
  dotenv.config();
}

initDb();

const app = express();

app.use(cors({ origin: true }));
app.use(cookieParser());

app.get('/', (req, res) => res.send('Hello World!'));
app.get('/v1/mvt/:table/:z/:x/:y', getMvt);
app.get('/point_summary', getSummaryByLatLon);

app.listen(PORT, () => console.log(`listening on port ${PORT}`));
