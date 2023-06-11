import { Injectable } from '@angular/core';
import { OpenRouteHttp } from '../open-route.http';
import { FeatureCollection, MultiPoint, Polygon, Position } from 'geojson';

export type DirectionProfile = 'driving-car';
export type DirectionSearch = {
  coordinates: Position[]; // Array<[number /*long */, number /*lat */]>;
  alternative_routes?: {
    share_factor: number;
    target_count: number;
    weight_factor: number;
  };
  attributes?: ('avgspeed' | 'detourfactor' | 'percentage')[];
  continue_straight?: boolean;
  elevation?: boolean;
  extra_info?: (
    | 'countryinfo'
    | 'csv'
    | 'green'
    | 'noise'
    | 'osmid'
    | 'roadaccessrestrictions'
    | 'shadow'
    | 'steepness'
    | 'suitability'
    | 'surface'
    | 'tollways'
    | 'traildifficulty'
    | 'waycategory'
    | 'waytype'
  )[];
  geometry_simplify?: boolean;
  id?: any;
  instructions?: boolean;
  instructions_format?: 'text' | 'html';
  language?: 'en' | 'fr';
  maneuvers?: boolean;
  options?: {
    avoid_borders: 'all' | 'controlled' | 'none';
    avoid_countries: number[]; //array of country ids
    avoid_features: ('highway' | 'tollways' | 'ferries')[];
    avoid_polygons: Polygon;
    round_trip: {
      length: number;
      points: number;
      seed: number;
    };
  };
  preference?: 'fastest' | 'recommended' | 'shortest';
  radiuses?: number[];
  suppress_warnings?: boolean;
  units?: 'km' | 'm' | 'mi';
  geometry?: boolean;
  maximum_speed?: number;
};

/**
 * @link https://github.com/GIScience/openrouteservice/blob/master/docs/documentation/extra-info/Steepness.md?plain=1
 */
export type Steepness = {
  '-5': '>16%';
  '-4': '12-15%';
  '-3': '7-11%';
  '-2': '4-6%';
  '-1': '1-3%';
  '0 ': '0%';
  '1 ': '1-3%';
  '2 ': '4-6%';
  '3 ': '7-11%';
  '4 ': '12-15%';
  '5 ': '>16%';
};

export type Country = {
  id: number;
  name: string;
  name_en: string;
};
export type Summary = {
  distance: number;
  duration: number;
  ascent: number;
  descent: number;
  transfers: number;
};
export type ExtraLongSummary = {
  value: number;
  distance: number;
  amount: number;
};
export type Maneuver = {
  location: number[]; //lat/long
  bearing_before: number;
  bearing_after: number;
};
export type Step = {
  distance: number;
  duration: number;
  type: number;
  instruction: string;
  name: string;
  exit_number: number;
  exit_bearings: number[];
  way_points: number[];
  maneuver: Maneuver;
};
export type Segment = {
  distance: number;
  duration: number;
  steps: Step[];
  detourfactor: number;
  percentage: number;
  avgspeed: number;
  ascent: number;
  descent: number;
};
export type Stop = {
  stop_id: string;
  name: string;
  location: number[]; //lat/lng
  arrival_time: Date;
  planned_arrival_time: Date;
  predicted_arrival_time: Date;
  arrival_cancelled: boolean;
  departure_time: Date;
  planned_departure_time: Date;
  predicted_departure_time: Date;
  departure_cancelled: boolean;
};
export type Leg = {
  type: string;
  departure_location: string;
  trip_headsign: string;
  route_long_name: string;
  route_short_name: string;
  route_desc: string;
  route_type: number;
  distance: number;
  duration: number;
  departure: Date;
  arrival: Date;
  feed_id: string;
  trip_id: string;
  route_id: string;
  is_in_same_vehicle_as_previous: boolean;
  geometry: string;
  instructions: Step[];
  stops: Stop[];
};
export type Extra = {
  values: [number[]];
  summary: ExtraLongSummary[];
};
export type Warning = {
  code: number;
  message: string;
};
export type Route = {
  geometry: string;
  summary: Summary;
  segments: Segment[];
  way_points: number[];
  legs: Leg[];
  extras: {
    [k: string]: Extra;
  };
  departure: Date;
  arrival: Date;
  warnings: Warning[];
};
export type Metadata = {
  id: string;
  attribution: string;
  osm_file_md5_hash: string;
  service: string;
  timeStamp: number;
  request: any;
  engine: {
    version: string;
    build_date: string;
    graph_date: string;
  };

  system_message: string;
};
export type DirectionResponse = {
  routes: Route[];
  bbox: number[][]; //array of lat/lng
  metadata: Metadata;
};
export type PlaceType = {
  venue: string;
  address: string;
  street: string;
  neighbourhood: string;
  borough: string;
  localadmin: string;
  locality: string;
  county: string;
  macrocounty: string;
  region: string;
  macroregion: string;
  country: string;
};
export type GeocodeSearch = {
  text: string;
  'focus.point.lat'?: number;
  'focus.point.lon'?: number;
  'boundary.rect.min_lat'?: number;
  'boundary.rect.min_lon'?: number;
  'boundary.rect.max_lat'?: number;
  'boundary.rect.max_lon'?: number;
  'boundary.circle.lat'?: number;
  'boundary.circle.lon'?: number;
  'boundary.circle.radius'?: number;
  'boundary.gid'?: string;
  'boundary.country'?: string; //string in
  sources?: 'osm' | 'oa' | 'wof' | 'gn';
  layers?: (
    | 'venue'
    | 'address'
    | 'street'
    | 'neighbourhood'
    | 'borough'
    | 'localadmin'
    | 'locality'
    | 'county'
    | 'macrocounty'
    | 'region'
    | 'macroregion'
    | 'country'
    | 'coarse'
    | 'postalcode'
  )[];
  size: number;
};

@Injectable({
  providedIn: 'root',
})
export class DirectionsService {
  constructor(private http: OpenRouteHttp) {}
  fetchDirections(profile: DirectionProfile, path: Array<MultiPoint>) {
    return this.http.post<DirectionResponse>(`/v2/directions/${profile}/json`, {
      coordinates: path.flatMap((x) => x.coordinates),
    } as DirectionSearch);
  }
  searchGeo(address: string) {
    return this.http.get('/geocode/search', {
      params: {
        text: address,
      },
    });
  }
}
