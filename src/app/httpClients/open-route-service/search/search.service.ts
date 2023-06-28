import { Injectable } from '@angular/core';
import { OpenRouteHttp } from '../open-route.http';
import { z } from 'zod';
import { GeocodeResponse, GeocodeSearch } from './types';
import { Observable } from 'rxjs';
import { handleAppError } from '@shared/extensions/handleErrorRx.pipe';
import { ErrorHandlerService } from '@shared/error-handler.service';

@Injectable({
  providedIn: 'root',
})
export class SearchService {
  constructor(
    private http: OpenRouteHttp,
    private errorHandler: ErrorHandlerService
  ) {}
  search(request: GeocodeSearch) {
    return this.http
      .get<GeocodeResponse>('/geocode/search', {
        params: {
          ...request,
        },
      })
      .pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: `could not find find location ${request.text}, sorry`,
          status: 0,
          context: 'auth',
        }))
      );
  }
  autocomplete(request: GeocodeSearch): Observable<GeocodeResponse> {
    return this.http
      .get<GeocodeResponse>('/geocode/autocomplete', {
        params: {
          ...request,
        },
      })
      .pipe(
        handleAppError(this.errorHandler, (err) => ({
          message: `could not find find location ${request.text}, sorry`,
          status: 0,
          context: 'auth',
        }))
      );
  }
}
