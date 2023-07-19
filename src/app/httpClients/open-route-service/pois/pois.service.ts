import { Injectable } from '@angular/core';
import { OpenRouteHttp } from '../open-route.http';
import { ErrorHandlerService } from '@shared/error-handler.service';
import {
  PoiTypes,
  requestSchema,
  geometry,
  PoiSearchResponse,
  PoiSearchRequest,
  PoiFilter,
} from './types';
import {
  Observable,
  catchError,
  delay,
  of,
  retry,
  switchMap,
  tap,
  timer,
} from 'rxjs';

const EARTH_CIR_METERS = 40075016.686;
const EARTH_RADIUS_METERS = 6.378e6;

const degreesPerMeter = 360 / EARTH_RADIUS_METERS;
const earth = 6378.137, //radius of the earth in kilometer
  pi = Math.PI,
  METER_PER_DEGREE = 1 / (((2 * pi) / 360) * earth) / 1000; //1 meter in degree

function toRadians(degrees: number) {
  return (degrees * Math.PI) / 180;
}

function latLngToBounds(
  lat: number,
  lng: number,
  width: number, //distance in meters
  height: number //distance in meters
) {
  // const dx = width / 2;
  // const dy = height / 2;

  // const new_latitude =
  //   Math.abs(lat) + (dy / EARTH_RADIUS_METERS) * (180 / Math.PI);
  // const new_longitude =
  //   Math.abs(lng) +
  //   ((dx / EARTH_RADIUS_METERS) * (180 / Math.PI)) /
  //     Math.cos((Math.abs(lat) * Math.PI) / 180);
  // const dlng = new_longitude - Math.abs(lng);
  // const dlat = new_latitude - Math.abs(lat);

  const calcLat = (dst: number) => lat + dst * METER_PER_DEGREE;
  const calcLng = (dst: number) =>
    lng + (dst * METER_PER_DEGREE) / Math.cos(lat * (pi / 180));
  // min Longitude , min Latitude , max Longitude , max Latitude
  return [
    [calcLng(-width / 2), calcLat(-height / 2)],
    [calcLng(width / 2), calcLat(height / 2)],
    // [lng - dlng, lat - dlat],
    // [lng + dlng, lat + dlng],
  ];
}

@Injectable({
  providedIn: 'root',
})
export class PoisService {
  private KEY_POI_LIST = 'pois-list';
  constructor(
    private http: OpenRouteHttp,
    private errorHandler: ErrorHandlerService
  ) {}
  fetchPois(
    location: GeoJSON.Point,
    filters: PoiFilter | undefined = undefined
  ) {
    const request = requestSchema.parse({
      request: 'pois',
      geometry: {
        bbox: latLngToBounds(
          location.coordinates[1],
          location.coordinates[0],
          4500,
          4500
        ),
        geojson: { ...location },
        buffer: 2000,
      },
      filters,
      limit: 2000,
    });
    return this.request<PoiSearchResponse>(request);
  }
  fetchPoiCategories(): Observable<PoiTypes> {
    //just brute force a little cache in localstorage, we don't need to fetch these all the time
    //should maybe do this on startup
    return of(localStorage.getItem(this.KEY_POI_LIST)).pipe(
      switchMap((value) => {
        if (value) return of(JSON.parse(value));

        return this.request<PoiTypes>({
          request: 'list',
        }).pipe(
          catchError((err) => of(null)),
          retry({ delay: () => timer(1500) }),
          tap({
            next: (val) =>
              localStorage.setItem(this.KEY_POI_LIST, JSON.stringify(val)),
          })
        );
      })
    );
  }

  private request<T>(req: PoiSearchRequest) {
    return this.http.post<T>('/pois', req);
  }
}
