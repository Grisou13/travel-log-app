import { Injectable } from '@angular/core';
import { OpenRouteHttp } from '../open-route.http';
import { z } from 'zod';
import { GeocodeResponse, GeocodeSearch } from './types';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(private http: OpenRouteHttp) {}
  search(request: GeocodeSearch) {
    return this.http.get<GeocodeResponse>('/geocode/search', {
      params: {
        ...request,
      },
    });
  }
  autocomplete(request: GeocodeSearch) {
    return this.http.get<GeocodeResponse>('/geocode/autocomplete', {
      params: {
        ...request,
      },
    });
  }
}
