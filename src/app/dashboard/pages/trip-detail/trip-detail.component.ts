import { Component, NgZone, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  Subscription,
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
import { FormArray, FormControl, FormGroup } from '@angular/forms';
import { PlaceType } from '@httpClients/travelLogApi/places/schema';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.sass'],
})
export class TripDetailComponent implements OnDestroy {
  initialValue: Partial<{
    title: string | null;
    description: string | null;
  }> | null = null;
  sub: Subscription | null = null;
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService
  ) {}
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  trip$: Observable<Trip | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('tripId') || null;
      if (id === null) return of(null);
      return this.tripService.get(id);
    }),
    tap({
      next: (val) => {
        this.formGroup.patchValue({
          title: val?.title ?? '',
          description: val?.description ?? '',
        });
        this.initialValue = this.formGroup.value;
      },
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
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  formGroup = new FormGroup({
    title: new FormControl(''),
    description: new FormControl(''),
  });
  tripChange$ = this.formGroup.valueChanges.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );
  onTitleChange(txt: string) {
    this.formGroup.controls.title.setValue(txt);
    console.log(txt);
  }
  onDescriptionChange(txt: string) {
    this.formGroup.controls.description.setValue(txt);
  }
  updateTrip(trip: Trip) {
    this.sub = this.tripService
      .update(trip.id, {
        ...trip,
        title: this.formGroup.value?.title ?? trip.title,
        description: this.formGroup.value?.description ?? trip.description,
      })
      .subscribe();
  }
  cancel() {
    this.formGroup.reset(this?.initialValue ?? {});
  }
}
