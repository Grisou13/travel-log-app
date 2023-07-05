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
    request: DirectionRequest,
    profile: DrivingProfils = 'driving-car',
  ) {
    
    return this.http
      .post<DirectionsResponse>(`/v2/directions/${profile}/json`, request)
      .pipe(switchMap((v) => DirectionsResponse.parseAsync(v)));
  }
  fetchDirectionsGeoJson(
    request: DirectionRequest,
    profile: DrivingProfils = 'driving-car'
  ) {
    
    return this.http.post<GeoJSON.FeatureCollection>(
      `/v2/directions/${profile}/geojson`,
      request
    );
    //.pipe(switchMap((v) => DirectionsResponse.parseAsync(v)));
  }
}
