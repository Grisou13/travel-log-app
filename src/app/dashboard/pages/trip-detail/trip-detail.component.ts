import { Component, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  combineLatest,
  concatMap,
  delay,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  pairwise,
  share,
  shareReplay,
  startWith,
  switchMap,
  tap,
  withLatestFrom,
  zip,
} from 'rxjs';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trips';
import { DirectionsService } from '@httpClients/open-route-service/directions/directions.service';
import { PlaceService } from '../../services/place.service';
import { Point } from 'geojson';
import { Result } from '@shared/components/cities-search/cities-search.component';
import { iconDefault } from '@shared/components/map/map.component';
import * as L from 'leaflet';
import * as _ from 'lodash';
import { Place } from '../../models/places';
import { FormArray, FormControl } from '@angular/forms';
import { PlaceType } from '@httpClients/travelLogApi/places/schema';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.sass'],
})
export class TripDetailComponent {
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
    switchMap((trip) => {
      if (trip === null) return EMPTY;
      return combineLatest([
        of(trip),
        this.placeService.fetchForTrip(trip),
      ]).pipe(
        map(([trip, places]) => {
          return { trip, places };
        })
      );
    })
  );
}
