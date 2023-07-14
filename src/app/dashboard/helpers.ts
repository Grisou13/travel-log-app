import { Result } from '@shared/components/cities-search/cities-search.component';
import { Place } from './models/places';
import { distance } from '../helpers';
import * as _ from 'lodash';
import * as L from 'leaflet';

export function getPlaceClosest(places: Place[], $event: Result): string {
  const distances = places.reduce((acc, cur) => {
    acc.push({ id: cur.id, dist: distance($event.location, cur.location) });
    return acc;
  }, [] as { id: string; dist: number }[]);
  const sorted = _.sortBy(distances, 'dist');
  return _.first(sorted)?.id || '-1';
}
export function timeConverter(num: number) {
  let roundhrs = Math.floor(num / 60);
  let mins = (num / 60 - roundhrs) * 60;
  let roundMins = Math.round(mins);
  if (num == 60) {
    return roundhrs + ' hour';
  }
  if (num > 60 && num < 120) {
    return roundhrs + ' hour and ' + roundMins + ' minutes';
  }
  if (num >= 60) {
    return roundhrs + ' hours and ' + roundMins + ' minutes';
  }
  return roundMins + ' minutes';
}
export function distConverter(num: number) {
  let roundKmtrs = Math.floor(num / 1000);
  let roundMtrs = Math.round(num);
  if (num < 1000) {
    return roundMtrs + ' m';
  }
  return roundKmtrs + ' km';
}

export const placeToMarker = (
  place: Place,
  options: L.MarkerOptions | undefined
) =>
  L.marker(
    [place.location.coordinates[1], place.location.coordinates[0]],
    options
  );
