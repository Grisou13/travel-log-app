import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { TripService } from '../../../services/trip.service';
import { Trip } from '../../../models/trips';

import * as _ from 'lodash';
import { PlaceService } from 'src/app/dashboard/services/place.service';
@Component({
  selector: 'app-trip-home',
  templateUrl: './trip-home.component.html',
  styleUrls: [],
})
export class TripHomeComponent {
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService
  ) {}

  trip$: Observable<Trip | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('tripId') || null;
      if (id === null) return of(null);
      return this.tripService.get(id);
    })
  );
  loadable$ = this.trip$.pipe(
    switchMap((trip) =>
      trip === null
        ? of({ places: [], trip: null })
        : this.placeService
            .fetchForTrip(trip)
            .pipe(map((places) => ({ places, trip })))
    ),
    distinctUntilChanged(),
    shareReplay(1)
  );
}
