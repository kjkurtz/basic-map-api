import area from '@turf/area';
import { convertArea } from '@turf/helpers';
import center from '@turf/center';

export const getFeatureArea = (geometry) => {
  const calculatedAreaSqMeters = area(geometry);
  const areaAcres = convertArea(calculatedAreaSqMeters, 'meters', 'acres');
  const roundedAcres = Math.round(areaAcres * 100) / 100;
  return roundedAcres;
};

export const getFeatureCenterpoint = (geometry) => {
  const centerpoint = center(geometry);
  return {
    lat: centerpoint.geometry.coordinates[1],
    lon: centerpoint.geometry.coordinates[0],
  };
};
