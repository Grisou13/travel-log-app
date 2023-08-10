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

@Component({
  templateUrl: './trip-detail-map.component.html',
  styleUrls: [],
})
export class TripDetailMapComponent {
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  trip$: Observable<Trip | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('tripId') || null;
      if (id === null) return of(null);
      return this.tripService.get(id);
    })
  );
  loadable$ = this.trip$.pipe(distinctUntilChanged(), shareReplay(1));
}
