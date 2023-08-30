import { Result } from '@shared/components/cities-search/cities-search.component';
import { Place } from './models/places';
import { distance } from '../helpers';
import * as _ from 'lodash';
import * as L from 'leaflet';
import { PlaceType } from '@httpClients/travelLogApi/places/schema';
import { NewPlaceForm } from './components/add-place/add-place.component';
import { NewTripForm } from './components/new-trip/new-trip.component';

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
) => {
  return L.marker(
    [place.location.coordinates[1], place.location.coordinates[0]],
    options
  );
};

export const formToTrip = (payload: { form: NewTripForm }) => {
  const { form } = payload;

  let x: string | Date = form?.start?.dateOfVisit || new Date();
  let startDate = new Date();

  if (typeof x === 'string') {
    const y = x.split('-').map((z) => parseInt(z));
    startDate = new Date(y[0], y[1], y[2]);
  }

  x = form?.end?.dateOfVisit || new Date();
  let endDate = new Date();

  if (typeof x === 'string') {
    const y = x.split('-').map((z) => parseInt(z));
    endDate = new Date(y[0], y[1], y[2]);
  }

  let title = 'Trip from ' + form?.start?.title;
  if (
    typeof form.end !== 'undefined' &&
    typeof form.end.title !== 'undefined'
  ) {
    title += ' ' + form.end.title;
  }
  if (title.length >= 100) {
    title = title.slice(0, 100);
  }
  return {
    title: title,
    description: title,
    startDate,
    endDate: null, //dont use end date and only set it when using stop button
  };
};

export const formToPlace = (payload: {
  tripId: string;
  places: Place[];
  form: NewPlaceForm;
  geoJson: any | undefined;
}) => {
  const { places, tripId, form } = payload;
  if (tripId === null) return null;
  if (form.location == null) return null;
  if (
    form.location.lat === null ||
    form.location.lng === null ||
    typeof form.location.lat === 'undefined' ||
    typeof form.location.lng === 'undefined'
  )
    return null;

  const stops = _.orderBy(
    places.filter((x) => x.type === 'TripStop'),
    'order'
  );
  let previousStop: Place | null = null;
  if (stops.length > 0)
    previousStop = stops[form?.order || stops.length - 1] || null;

  let x: string | Date = form.dateOfVisit || new Date();
  let startDate = new Date();

  if (typeof x === 'string') {
    const y = x.split('-').map((z) => parseInt(z));
    startDate = new Date(y[0], y[1], y[2]);
  }
  let title = form.title;
  if (title === null || typeof title === 'undefined') {
    title = 'Place for trip #' + places.length + 1;
  }
  let description = form.description;
  if (
    description === null ||
    typeof description === 'undefined' ||
    description.length <= 0
  ) {
    description = 'Place for trip #' + places.length + 1;
  }
  let order = form.order;
  if (order === null || typeof order === 'undefined') {
    order =
      (stops.at(-1)?.order ||
        places.filter((x) => x.type === 'TripStop').length) + 1;
  }
  const type: PlaceType = form.placeType || 'TripStop';
  return {
    name: title,
    tripId,
    description,
    type,
    startDate,
    endDate: undefined,
    order,
    directions: {
      distance: 0,
      previous: null, //geoJson || null
      next: {},
    },
    infos: {
      relatedToPlace: previousStop?.id,
    },
    location: {
      type: 'Point' as 'Point',
      coordinates: [form.location.lng, form.location.lat],
    },
  };
};
