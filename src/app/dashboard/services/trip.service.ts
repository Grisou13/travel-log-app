import { AuthService } from 'src/app/auth/services/auth-service.service';
import { Injectable } from '@angular/core';
import * as _ from 'lodash';
import {
  BehaviorSubject,
  map,
  of,
  switchMap,
  tap,
  Observable,
  catchError,
  shareReplay,
  withLatestFrom,
  forkJoin,
  mergeMap,
  mergeAll,
  scan,
  concatMap,
  merge,
  combineLatest,
  concat,
  throwError,
} from 'rxjs';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import type { AddTrip, Trip } from '../models/trips';
import { CacheableService } from './cachable.service';
import { ArgumentTypes } from 'src/app/helpers';

@Injectable({
  providedIn: 'root',
})
export class TripService extends CacheableService<Trip, AddTrip, string> {
  private lastRefresh = -1;
  constructor(
    private authService: AuthService,
    private travelLogService: TravelLogService
  ) {
    super(-1); //every second refresh data
  }

  override fetchRemote(
    params: ArgumentTypes<typeof this.travelLogService.trips.fetchAll>[0]
  ): Observable<Trip[]> {
    return this.authService.user$.pipe(
      switchMap((user) => {
        if (user === null) return of([]);
        return this.travelLogService.trips.fetchAll({
          ...params,
          user: user.id,
        });
      })
    );
  }
  override removeRemote(id: string): Observable<boolean> {
    return this.travelLogService.trips.removeById(id).pipe(
      map((x) => true),
      catchError((err) =>
        concat(
          of(false),
          throwError(() => new Error('Could not delete ' + id + ' remotly'))
        )
      )
    );
  }
  override fetchSingleRemote(id: string): Observable<Trip> {
    return this.travelLogService.trips.fetchById(id);
  }
  override updateRemote(id: string, payload: Trip): Observable<Trip> {
    return this.travelLogService.trips.update(payload);
  }
  override createRemote(payload: AddTrip): Observable<Trip> {
    return this.travelLogService.trips.create(payload);
  }
}
