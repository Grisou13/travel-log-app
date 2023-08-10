import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Modal, Ripple, initTE } from 'tw-elements';

import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { DirectionsService } from '@httpClients/open-route-service/directions/directions.service';
import { DirectionRequest } from '@httpClients/open-route-service/directions/schema';
import { PlaceType } from '@httpClients/travelLogApi/places/schema';
import { Result } from '@shared/components/cities-search/cities-search.component';
import * as _ from 'lodash';
import {
  BehaviorSubject,
  Subscription,
  combineLatest,
  distinctUntilChanged,
  map,
  of,
  shareReplay,
  switchMap,
  tap,
  zip,
} from 'rxjs';
import { Place } from '../../../models/places';
import { Trip } from '../../../models/trips';
import { PlaceService } from '../../../services/place.service';
import { ActivatedRoute, Router } from '@angular/router';
import { TripService } from 'src/app/dashboard/services/trip.service';
import {
  NewPlaceForm,
  placeForm,
} from 'src/app/dashboard/components/add-place/add-place.component';
import { placeToMarker } from 'src/app/dashboard/helpers';
import { iconDefault } from '@shared/components/map/map.component';

@Component({
  templateUrl: './trip-add-place.component.html',
  styleUrls: [],
})
export class TripAddPlaceComponent implements OnDestroy {
  sub$: Subscription | null = null;

  tripId$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('tripId') || null;
      if (id === null) return of(null);

      return of(id);
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );
  places$ = this.tripId$.pipe(
    switchMap((trip) => {
      if (trip === null) return of([]);
      return this.placeService.fetchForTripId(trip);
    }),
    distinctUntilChanged(),
    shareReplay(1)
  );

  lastPlace$ = this.places$.pipe(
    map((places) => {
      const stops = places.filter((x) => x.type === 'TripStop');
      if (stops.length <= 0) return null;

      return stops.at(-1) as Place;
    })
  );

  lastPlaceAsMarker$ = this.lastPlace$.pipe(
    map((x) =>
      x === null ? null : placeToMarker(x, { icon: iconDefault(`${x.order}`) })
    )
  );
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService,
    private directionService: DirectionsService
  ) {}

  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }

  navigateToTrip() {
    setTimeout(
      () => this.router.navigate(['../../'], { relativeTo: this.route }),
      350
    );
  }

  form = new FormGroup({ ...placeForm.controls });

  addPlace() {
    this.sub$ = zip([this.tripId$, this.places$])
      .pipe(
        switchMap(([tripId, places]) => {
          const form = this.form.value;
          let payload = {
            tripId,
            places,
            form,
            previousStop: null,
            geoJson: {},
          } as {
            tripId: string;
            places: Place[];
            form: NewPlaceForm;
            previousStop: null | Place;
            geoJson: any;
          };
          const stops = places.filter((x) => x.type === 'TripStop');
          if (stops.length <= 0) return of(payload);
          const previousStop =
            _.orderBy(stops, 'order')[form?.order || stops.length - 1] || null;

          if (previousStop === null) {
            return of(payload);
          }
          payload.previousStop = previousStop;

          const request = DirectionRequest.parse({
            coordinates: [
              previousStop?.location.coordinates,
              [form?.location?.lng, form?.location?.lat],
            ],
            extra_info: ['tollways', 'roadaccessrestrictions'],
          });

          return this.directionService
            .fetchDirectionsGeoJson(request)
            .pipe(map((res) => ({ ...payload, geoJson: res })));
        }),
        switchMap(({ tripId, places, form, previousStop, geoJson }) => {
          if (tripId === null) return of(null);
          if (form.location == null) return of(null);
          if (
            form.location.lat === null ||
            form.location.lng === null ||
            typeof form.location.lat === 'undefined' ||
            typeof form.location.lng === 'undefined'
          )
            return of(null);
          let x: string | Date = form.dateOfVisit || new Date();
          let startDate = new Date();

          if (typeof x === 'string') {
            const y = x.split('-').map((z) => parseInt(z));
            startDate = new Date(y[2], y[1], y[0]);
          }
          let title = form.title;
          if (title === null || typeof title === 'undefined') {
            title = 'Place for trip #' + places.length + 1;
          }
          let description = form.description;
          if (
            description === null ||
            typeof description === 'undefined' ||
            description.length <= 0
          ) {
            description = 'Place for trip #' + places.length + 1;
          }
          let order = form.order;
          if (order === null || typeof order === 'undefined') {
            order = places.filter((x) => x.type === 'TripStop').length + 1;
          }
          const type: PlaceType = form.placeType || 'TripStop';
          const payload = {
            name: title,
            tripId,
            description,
            type,
            startDate,
            endDate: undefined,
            order,
            directions: {
              distance: 0,
              previous: geoJson || {},
              next: {},
            },
            infos: {
              relatedToPlace: previousStop?.id,
            },
            location: {
              type: 'Point' as 'Point',
              coordinates: [form.location.lng, form.location.lat],
            },
          };
          return this.placeService.add(payload);
        })
      )
      .subscribe({
        next: console.debug,
        complete: () => this.navigateToTrip(),
        error: console.error,
      });
  }
}
