import { Injectable } from '@angular/core';
import { OpenRouteHttp } from '../open-route.http';
import { ErrorHandlerService } from '@shared/error-handler.service';
import { PoiTypes } from './types';
import { catchError, delay, of, retry, switchMap, tap, timer } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PoisService {
  private KEY_POI_LIST = 'pois-list';
  constructor(
    private http: OpenRouteHttp,
    private errorHandler: ErrorHandlerService
  ) {}

  fetchPoiCategories() {
    //just brute force a little cache in localstorage, we don't need to fetch these all the time
    //should maybe do this on startup
    return of(localStorage.getItem(this.KEY_POI_LIST)).pipe(
      switchMap((value) => {
        if (value) return of(JSON.parse(value));

        return this.http
          .post<PoiTypes>('/pois', {
            request: 'list',
          })
          .pipe(
            catchError(err => of(null)),
            retry({delay: () => timer(1500)}),
            tap({
              next: (val) =>
                localStorage.setItem(this.KEY_POI_LIST, JSON.stringify(val)),
            })
          );
      })
    );
  }
}
