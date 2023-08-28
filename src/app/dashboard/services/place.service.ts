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
  distinctUntilChanged,
  startWith,
} from 'rxjs';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import type { AddPlace, Place } from '../models/places';
import { Trip } from '../models/trips';
import { CacheableService } from './cachable.service';
import * as _ from 'lodash';
@Injectable({
  providedIn: 'root',
})
export class PlaceService extends CacheableService<Place, AddPlace, string> {
  private lastRefresh = -1;
  constructor(
    private authService: AuthService,
    private travelLogService: TravelLogService
  ) {
    super(-1); //every second refresh data
  }
  getPlacesWithRelated(id: string) {
    return this.get(id).pipe(
      switchMap((current) => {
        if (
          typeof current === 'undefined' ||
          typeof current === 'boolean' ||
          current === null
        )
          return of(null);

        return this.fetchForTripId(current.tripId).pipe(
          map((places) => {
            const pois = places.filter(
              (x) =>
                x.infos?.relatedToPlace === id && x.type === 'PlaceOfInterest'
            );
            console.debug('Pois for place: ', pois);
            const stops = _.sortBy(
              places.filter((x) => x.type === 'TripStop'),
              'order'
            );
            const currentIdx = stops.findIndex((x) => x.id === current.id);

            let previousPlace = undefined;
            if (stops.length > 1) {
              previousPlace = stops[currentIdx - 1];
            }
            let nextPlace = null;
            if (currentIdx < stops.length - 1) {
              nextPlace = stops[currentIdx + 1];
            }
            return {
              current,
              pois,
              previousPlace,
              nextPlace,
              stops,
            };
          })
        );
      }),
      distinctUntilChanged(),
      shareReplay({ refCount: true, bufferSize: 1 })
    );
  }
  fetchForTripId(tripId: string) {
    const localItems = this.getAll();
    const filterFn = (x: Place) => x.tripId === tripId;
    //TODO maybe update this somehow every couple of times so things keep in sync?
    const placesForTrip = localItems.filter(filterFn);
    // if (placesForTrip.length > 0) return of(placesForTrip);

    return this.fetch({ trip: tripId }).pipe(
      tap({ subscribe: () => console.debug('Subscribing to place fetch') }),
      startWith(placesForTrip),
      switchMap((places) => {
        console.debug('Got places from api');
        console.debug(places);
        //doing this is pretty stupid, but for now it will work.
        // the idea is that fetchFor trip does not bring us from the cacheed items and will never emit a new value.
        // what we need here is an operator that allows us to add/update stuff and has an internal cache of it's own.
        // this allows us to keep the fetch for trip to be
        if (places.length <= 0) return of([]);
        if (tripId === undefined) return of([]);
        console.debug('Filtering for tripId: ', tripId);
        return this.items$.pipe(
          map((items) => {
            console.debug('Items in cache: ', items);
            return items.filter((i) => i.tripId === tripId);
          })
        );
      }),
      distinctUntilChanged(),
      shareReplay({ refCount: true, bufferSize: 1 })
    ); /*.pipe(
      switchMap(() => this.items$.pipe(map((i) => i.filter(filterFn))))
    );*/
  }
  fetchForTrip(trip: Trip) {
    return this.fetchForTripId(trip.id);
  }
  togglePoi(tripId: string, osmId: string, newPlace: AddPlace) {
    const currentPlaces = this.cacheSubject.getValue();
    const exists = currentPlaces.find((v) => v.infos?.misc_id === osmId);
    if (!exists) {
      return this.add(newPlace);
    }
    return this.delete(exists.id);
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
