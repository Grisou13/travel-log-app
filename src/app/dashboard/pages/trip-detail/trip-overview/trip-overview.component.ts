import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
  Observable,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { TripService } from '../../../services/trip.service';
import { Trip } from '../../../models/trips';

import * as _ from 'lodash';
import { PlaceService } from 'src/app/dashboard/services/place.service';
import { ToastrService } from 'ngx-toastr';
import { Place } from 'src/app/dashboard/models/places';
import { dateToForm } from 'src/app/dashboard/helpers';
@Component({
  templateUrl: './trip-overview.component.html',
  styleUrls: [],
})
export class TripOverviewComponent implements OnDestroy {
  dateToForm(x: any) {
    return dateToForm(x);
  }
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService,
    private toastrService: ToastrService,
    private router: Router
  ) {}

  trip$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('tripId') || null;
      if (id === null) return of(null);
      return this.tripService.get(id);
    })
  );

  places$ = this.trip$.pipe(
    switchMap((trip) => {
      if (trip === null) return of([]);

      return this.placeService.fetchForTrip(trip);
    })
  );

  vm$ = combineLatest([this.trip$, this.places$]).pipe(
    map(([trip, places]) => {
      const stops = _.orderBy(
        places.filter((x) => x.type === 'TripStop'),
        'order'
      );
      let lastStop = null;
      if (stops.length > 1) {
        lastStop = stops[stops.length - 1];
      }
      return {
        trip,
        lastStop,
        firstStop: stops[0] || null,
        places,
        stops,
      };
    })
  );

  ngOnDestroy(): void {
    this.deleteSub$?.unsubscribe();
  }
  deleteSub$: Subscription | null = null;
  deleteTrip(trip: Trip | null, places: Place[]) {
    if (trip === null) return;
    if (this.deleteSub$ != null) {
      this.deleteSub$.unsubscribe(); //don't repeat the operation if already subscribed?
    }

    this.deleteSub$ = forkJoin([
      ...places.map((x) => this.placeService.delete(x.id)),
      this.tripService.delete(trip.id),
    ])
      .pipe(
        map((deleted) => {
          if (deleted.some((x) => !x)) {
            return false;
          }
          return true;
        })
      )
      .subscribe({
        next: (val) => {
          if (val) {
            this.toastrService.success('Your trip was deleted successfully');
            this.router.navigate(['/dashboard/trips']);
          } else {
            this.toastrService.error(
              'Could not delete trip, please try again later'
            );
          }
        },
      });
  }
  updateSub$: Subscription | null = null;
  stopTrip(trip: Trip | null) {
    if (trip === null) return;
    if (!this.canStopTrip(trip)) return;
    if (this.updateSub$ !== null) {
      this.updateSub$.unsubscribe();
    }

    this.updateSub$ = this.tripService
      .update(trip.id, { ...trip, endDate: new Date() })
      .subscribe({
        next: (val) => {
          if (typeof val === 'boolean') {
            this.toastrService.error(
              'Could not update your trip, please try again later'
            );
            return;
          }
          this.toastrService.success('Your trip has been stopped!');
        },
      });
  }
  canStopTrip(trip: Trip | null) {
    if (trip === null) return false;

    return trip.endDate === null || trip.endDate === undefined;
  }
}
