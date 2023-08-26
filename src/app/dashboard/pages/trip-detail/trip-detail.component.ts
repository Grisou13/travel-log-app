import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import {
  EMPTY,
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
} from 'rxjs';
import { Trip } from '../../models/trips';
import { PlaceService } from '../../services/place.service';
import { TripService } from '../../services/trip.service';
import { Input, initTE } from 'tw-elements';

@Component({
  templateUrl: './trip-detail.component.html',
  styleUrls: [],
})
export class TripDetailComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService
  ) {}
  toggleForm($event: any) {
    if (this.formGroup.enabled) {
      this.formGroup.disable();
      return;
    }
    initTE({ Input });
    this.formGroup.enable();
  }
  formGroup = new FormGroup({
    editing: new FormControl(false),
    title: new FormControl(''),
    description: new FormControl(''),
    startDate: new FormControl(''),
    pictureUrl: new FormControl(''),
  });
  initialValue: typeof this.formGroup.value | null = null;
  sub: Subscription | null = null;
  ngOnInit(): void {
    initTE({ Input });
  }
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
          startDate: val?.startDate?.toISOString() ?? '',
        });
        this.initialValue = this.formGroup.value;
        this.formGroup.disable();
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

  updateTrip(trip: Trip) {
    let startDate = trip.startDate || Date.now;
    if (
      this.formGroup.value?.startDate !== null &&
      typeof this.formGroup.value?.startDate !== 'undefined'
    )
      startDate = new Date(this.formGroup.value.startDate);

    this.sub = this.tripService
      .update(trip.id, {
        ...trip,
        title: this.formGroup.value?.title ?? trip.title,
        description: this.formGroup.value?.description ?? trip.description,
        startDate: new Date(startDate.toString()),
      })
      .subscribe();
    this.formGroup.disable();
  }
  cancel() {
    this.formGroup.reset(this?.initialValue ?? {});
    this.formGroup.disable();
  }
}
