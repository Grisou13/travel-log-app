import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { Modal, Ripple, initTE } from 'tw-elements';

import { FormBuilder, Validators } from '@angular/forms';
import { DirectionsService } from '@httpClients/open-route-service/directions/directions.service';
import { DirectionRequest } from '@httpClients/open-route-service/directions/schema';
import { PlaceType } from '@httpClients/travelLogApi/places/schema';
import { Result } from '@shared/components/cities-search/cities-search.component';
import * as _ from 'lodash';
import {
  BehaviorSubject,
  Subscription,
  map,
  of,
  switchMap,
  tap,
  zip
} from 'rxjs';
import { Place } from '../../models/places';
import { Trip } from '../../models/trips';
import { PlaceService } from '../../services/place.service';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.sass'],
})
export class AddPlaceComponent implements OnDestroy, OnInit{
  selectedLocation: Result | null = null;
  sub$: Subscription | null = null
  @Input({ required: true }) set trip(t: Trip) {
    this.tripState.next(t);
  }
  private tripState = new BehaviorSubject<Trip | null>(null);
  @Output() placeCreated = new EventEmitter<Place>();

  newPlaceForm = this.fb.group({
    location: this.fb.group({
      lat: this.fb.control<number>(0,[]),
      lng: this.fb.control<number>(0, [])
    }),
    title: this.fb.control('', []),
    description: this.fb.control('',[]),
    dateOfVisit: this.fb.control('',[Validators.pattern(/\d\d-\d\d-\d\d\d\d/)]),
    placeType: this.fb.control<PlaceType>('TripStop',[Validators.required]),
    order: this.fb.control<number>(-1, []),
  })
  constructor(
    private placeService: PlaceService,
    private directionService: DirectionsService,
    private fb: FormBuilder,
    ) {}
  ngOnInit(): void {
    initTE({ Modal, Ripple });
  }
  ngOnDestroy(): void {
    this.sub$?.unsubscribe();
  }

  trip$ = this.tripState.asObservable();

  places$ = this.trip$.pipe(
    switchMap((trip) => {
      if (trip === null) return of([]);
      return this.placeService.fetchForTrip(trip);
    }),

    tap({
      next: (p) => {
        console.debug('Places new items');
        console.debug(p);
      },
    })
  );

  updateLocation($event: Result){
    this.newPlaceForm.patchValue({
      location: {
        lng: $event.location.coordinates[0],
        lat: $event.location.coordinates[1]
      },
      title: $event.name
    })
  }
  addPlace() {
    if(this.newPlaceForm.invalid){
      return;
    }
    this.sub$ = zip([this.trip$, this.places$, this.newPlaceForm.valueChanges])
      .pipe(
        switchMap(([trip, places, form]) => {
          const stops = places.filter((x) => x.type === 'TripStop');
          if (stops.length <= 0) return of({ trip, places, geoJson: null, form, previousStop: null });
          const previousStop = _.orderBy(stops, 'order')[form?.order || stops.length -1] || null;
          let payload = {
              trip,
              places,
              form,
              previousStop,
              geoJson: {},
            }
          if(previousStop === null){
            return of(payload);
          }
          const request = DirectionRequest.parse({
            coordinates: [
              previousStop?.location.coordinates,
              [form?.location?.lng, form?.location?.lat],
            ],
            extra_info: ['tollways', 'roadaccessrestrictions'],
          });

          return this.directionService.fetchDirectionsGeoJson(request).pipe(
            map((res) => ({...payload, geoJson: res}))
          );
        }),
        switchMap(({ trip, places, form, previousStop, geoJson }) => {
          if (trip === null) return of(null);
          if(form.location == null) return of(null);
          if(form.location.lat === null || form.location.lng === null ||typeof form.location.lat === 'undefined' || typeof form.location.lng === 'undefined') return of(null);
          let x: string  | Date = form.dateOfVisit || new Date();
          let startDate = new Date();

          if(typeof x === 'string'){
            const y = x.split('-').map(z => parseInt(z));
            startDate = new Date(y[2],y[1],y[0])
          }
          let title = form.title;
          if(title === null || typeof title === 'undefined'){
            title = 'Place for trip #'+places.length + 1
          }
          let description = form.description;
          if(description === null || typeof description === 'undefined'){
            description = 'Place for trip #'+places.length + 1
          }
          let order = form.order;
          if(order === null || typeof order === 'undefined'){
            order = places.filter((x) => x.type === 'TripStop').length + 1
          }
          const type: PlaceType = form.placeType || "TripStop";
          const payload = {
            name: title,
            tripId: trip.id,
            description,
            type,
            startDate,
            endDate: undefined,
            order ,
            directions: {
              distance: 0,
              previous: geoJson || {},
              next: {},
            },
            infos: {
              relatedToPlace:
                previousStop?.id,
            },
            location: {
              type: "Point" as "Point",
              coordinates: [form.location.lng, form.location.lat]
            },
          };
          return this.placeService.add(payload);
        })
      )
      .subscribe({
        next: console.debug,
        complete: console.debug,
        error: console.error,
      });
  }
}
