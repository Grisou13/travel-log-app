import { Injectable } from '@angular/core';
import { OpenRouteHttp } from '../open-route.http';
import { FeatureCollection, MultiPoint, Polygon, Position } from 'geojson';
import { DirectionRequest, DrivingProfils, DirectionsResponse } from './schema';
import { map, of, switchMap } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DirectionsService {
  constructor(private http: OpenRouteHttp) {}
  fetchDirections(
    waypoints: MultiPoint,
    profile: DrivingProfils = 'driving-car'
  ) {
    const request = DirectionRequest.parse({
      coordinates: waypoints.coordinates,
    });
    return this.http
      .post<DirectionsResponse>(`/v2/directions/${profile}/json`, request)
      .pipe(switchMap((v) => DirectionsResponse.parseAsync(v)));
  }
}
