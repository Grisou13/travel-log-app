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
  filter,
  zip,
  combineLatest,
} from 'rxjs';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import type { AddTrip, Trip } from '../models/trips';
import type { Trip as ApiTrip } from '@httpClients/travelLogApi/trips/schema';
import { PlaceService } from './place.service';
@Injectable({
  providedIn: 'root',
})
export class TripService {
  private itemsSubject = new BehaviorSubject<Trip[]>([]);
  public items$;

  constructor(
    private authService: AuthService,
    private placeService: PlaceService,
    private travelLogService: TravelLogService
  ) {
    const placeCreate$ = this.placeService.onCreate$.pipe(
      switchMap((place) => {
        if (!place) return of(null);
        if (!place.tripId) return of(null);

        return this.get(place.tripId).pipe(
          tap((trip) => {
            if (!trip) return;
            this.updateItem(trip.id, {
              ...trip,
              places: [...trip.places, place],
            });
          })
        );
      })
    );
    const placeDelete$ = this.placeService.onDelete$.pipe(
      switchMap((place) => {
        if (!place) return of(null);
        if (!place.tripId) return of(null);

        return this.get(place.tripId).pipe(
          tap((trip) => {
            if (!trip) return;
            let index = trip.places.findIndex((x) => x.id === place.id);
            if (index < 0) return;
            trip.places.splice(index, 1);
            this.updateItem(trip.id, {
              ...trip,
            });
          })
        );
      })
    );
    const placeUpdate$ = this.placeService.onUpdate$.pipe(
      switchMap((place) => {
        if (!place) return of(null);
        if (!place.tripId) return of(null);

        return this.get(place.tripId).pipe(
          tap((trip) => {
            if (!trip) return;
            this.updateItem(trip?.id, {
              ...trip,
              places: trip?.places.map((x) => (x.id == place.id ? place : x)),
            });
          })
        );
      })
    );
    const dataLoader$ = this.fetch().pipe(
      withLatestFrom(this.itemsSubject.asObservable()),
      switchMap((x) => x)
    );
    this.items$ = dataLoader$.pipe(shareReplay());

    // zip(placeCreate$, placeUpdate$, placeDelete$);
    // this.items$ = combineLatest([
    //   dataLoader$,
    //   zip(placeCreate$, placeUpdate$, placeDelete$),
    // ]).pipe(
    //   switchMap(([x, ...y]) => x),
    //   shareReplay()
    // );
  }

  clear(): void {
    this.itemsSubject.next([]);
  }

  private getAll(): Trip[] {
    return this.itemsSubject.getValue();
  }

  get(id: string) {
    const currentItems: Trip[] = this.getAll();
    if (currentItems.length === 0) {
      return this.fetchItem(id);
    }

    const index1 = currentItems.findIndex((element) => {
      return element.id === id;
    });
    return index1 >= 0 && currentItems[index1]
      ? of(currentItems[index1])
      : this.fetchItem(id);
  }

  delete(id: string): Observable<boolean> {
    return this.travelLogService.trips.removeById(id).pipe(
      map((data) => {
        return true;
      }),
      tap((success) => {
        if (success) {
          this.deleteItem(id);
        }
      }), // when success, delete the item from the local service
      catchError((err) => {
        return of(false);
      })
    );
  }

  private fetchItem(id: string): Observable<Trip | null> {
    return this.travelLogService.trips
      .fetchById(id)
      .pipe(switchMap(this.fetchPlacesForTrip))
      .pipe(
        catchError((err) => {
          return of(null);
        })
      );
  }

  update(id: string, payload: Trip) {
    return this.travelLogService.trips.update(payload).pipe(
      tap((item) => {
        if (item) {
          this.updateItem(id, { ...item, places: payload.places });
        }
      }), // when success result, update the item in the local service
      catchError((err) => {
        return of(false);
      })
    );
  }

  add(payload: AddTrip) {
    return this.travelLogService.trips.create(payload).pipe(
      map((t) => ({ ...t, places: [] })),
      tap((item) => {
        if (item) {
          this.addItem(item);
        }
      }), // when success, add the item to the local service
      catchError((err) => {
        return of(false);
      })
    );
  }

  private deleteItem(id: string): boolean {
    const currentItems: Trip[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems.splice(index1, 1);
        this.itemsSubject.next(currentItems);
        return true;
      }
    }
    return false;
  }

  private addItem(item: Trip): void {
    const currentItems: Trip[] = this.getAll();
    currentItems.push(item);
    this.itemsSubject.next(currentItems);
  }

  private updateItem(id: string, item: Trip): boolean {
    const currentItems: Trip[] = this.getAll();
    if (currentItems.length > 0) {
      const index1 = currentItems.findIndex((element) => {
        return element.id === id;
      });
      if (index1 >= 0) {
        currentItems[index1] = item;
        this.itemsSubject.next(currentItems);
        return true;
      }
    }
    return false;
  }

  fetch(): Observable<Array<Trip>> {
    // this.clear();

    return this.authService.user$.pipe(
      switchMap((user) => {
        if (!user) return of([]);

        return this.travelLogService.trips.fetchAll({ user: user.id });
      }),
      mergeMap((trips) =>
        forkJoin(trips.map((t) => this.fetchPlacesForTrip(t)))
      ),

      tap((items) => {
        if (items) {
          this.itemsSubject.next(items);
        }
      }),
      catchError((err) => {
        return of([]);
      })
    );
  }

  private fetchPlacesForTrip(trip: ApiTrip) {
    return this.travelLogService.places
      .fetchAll({ trip: trip.id })
      .pipe(
        map((places) => ({ ...trip, places: _.sortBy(places, ['order']) }))
      );
  }
}
