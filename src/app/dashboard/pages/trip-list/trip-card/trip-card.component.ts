import { Component, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  Observable,
  filter,
  last,
  map,
  of,
  share,
  shareReplay,
  startWith,
  switchMap,
} from 'rxjs';
import { Trip } from 'src/app/dashboard/models/trips';
import { PlaceService } from 'src/app/dashboard/services/place.service';
import { AsObservable, ObservableInput, Observe } from 'src/app/helpers';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: [],
})
export class TripCardComponent {
  // @Observe<Trip>('trip')
  // public trip$!: Observable<Trip>;

  // @Input('trip') @AsObservable() trip$!: Observable<Trip>;
  @Input({ required: true }) set trip(t: Trip) {
    this.tripState.next(t);
  }

  private tripState = new BehaviorSubject<Trip | null>(null);

  trip$ = this.tripState.asObservable();
  places$ = this.trip$.pipe(
    switchMap((trip) => {
      if (trip === null) return of([]);
      return this.placeService.fetchForTrip(trip);
    }),
    shareReplay(1)
  );
  tripStops$ = this.places$.pipe(
    map((places) => places.filter((x) => x.type === 'TripStop'))
  );
  tripEnd$ = this.tripStops$.pipe(
    map((places) => {
      if (places === null) return null;
      if (places.length <= 1) return null;
      return places.pop();
    })
  );
  tripStart$ = this.tripStops$.pipe(
    map((places) => {
      if (places === null) return null;
      return places.shift();
    })
  );

  constructor(private placeService: PlaceService) {}
}
