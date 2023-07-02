import { ArgumentTypes } from 'src/app/helpers';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { Injectable } from '@angular/core';
import {
  BehaviorSubject,
  concat,
  map,
  of,
  switchMap,
  tap,
  Observable,
  catchError,
  shareReplay,
  withLatestFrom,
  combineLatest,
  throwError,
  filter,
} from 'rxjs';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import type { AddPlace, Place } from '../models/places';
import { Trip } from '../models/trips';
import { CacheableService } from './cachable.service';
@Injectable({
  providedIn: 'root',
})
export class PlaceService extends CacheableService<Place, AddPlace, string> {
  constructor(
    private authService: AuthService,
    private travelLogService: TravelLogService
  ) {
    super(-1); //every second refresh data
  }

  fetchForTrip(trip: Trip) {
    const localItems = this.getAll();
    const filterFn = (x: Place) => x.tripId === trip.id;
    //TODO keep a map of places for trips by tripid for this to be better
    const placesForTrip = localItems.filter(filterFn);
    if (placesForTrip.length > 0) return of(placesForTrip);

    return this.fetch({ trip: trip.id }); /*.pipe(
      switchMap(() => this.items$.pipe(map((i) => i.filter(filterFn))))
    );*/
  }

  override fetchRemote(
    params: ArgumentTypes<typeof this.travelLogService.places.fetchAll>[0]
  ): Observable<Place[]> {
    return this.authService.IsAuthenticated$.pipe(
      switchMap((user) => {
        if (!user) return of([]);
        return this.travelLogService.places.fetchAll(params);
      })
    );
  }
  override removeRemote(id: string): Observable<boolean> {
    return this.travelLogService.places.removeById(id).pipe(
      map((x) => true),
      catchError((err) =>
        concat(
          of(false),
          throwError(() => new Error('Could not delete ' + id + ' remotly'))
        )
      )
    );
  }
  override fetchSingleRemote(id: string): Observable<Place> {
    return this.travelLogService.places.fetchById(id);
  }
  override updateRemote(id: string, payload: Place): Observable<Place> {
    return this.travelLogService.places.update(payload);
  }
  override createRemote(payload: AddPlace): Observable<Place> {
    return this.travelLogService.places.create(payload);
  }
}
