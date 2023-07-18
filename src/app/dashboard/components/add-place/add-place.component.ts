import { Component, EventEmitter, Input, NgZone, Output } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  combineLatest,
  concat,
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
import { getPlaceClosest } from '../../helpers';
import { DirectionRequest } from '@httpClients/open-route-service/directions/schema';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.sass'],
})
export class AddPlaceComponent {
  selectedLocation: Result | null = null;
  @Input({ required: true }) set trip(t: Trip) {
    this.tripState.next(t);
  }
  private tripState = new BehaviorSubject<Trip | null>(null);
  @Output() placeCreated = new EventEmitter<Place>();

  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService,
    private directionService: DirectionsService,
    private zone: NgZone
  ) {}

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

  public placeType = new FormControl<PlaceType>('TripStop', []);
  addPlace($event: Result) {
    zip([this.trip$, this.places$])
      .pipe(
        switchMap(([trip, places]) => {
          const stops = places.filter((x) => x.type === 'TripStop');
          if (stops.length <= 0) return of({ trip, places, geoJson: null });
          const lastStop = _.orderBy(stops, 'order').pop();

          const request = DirectionRequest.parse({
            coordinates: [
              lastStop?.location.coordinates,
              $event.location.coordinates,
            ],
            extra_info: ['tollways', 'roadaccessrestrictions'],
          });

          return this.directionService.fetchDirectionsGeoJson(request).pipe(
            map((res) => ({
              trip,
              places,
              geoJson: res,
            }))
          );
        }),
        switchMap(({ trip, places, geoJson }) => {
          if (trip === null) return of(null);

          const type =
            this.placeType.value === null ? 'TripStop' : this.placeType.value;
          const payload = {
            name: $event.name,
            tripId: trip.id,
            description: 'Stop at ' + $event.name,
            type,
            startDate: new Date(),
            //when using this call there should already be one place for the trip
            //therefor if we do a places.length -1 it should correspond to atleast 0
            // also having an order that starts at -1 has no incidence
            order:
              type === 'TripStop'
                ? places.filter((x) => x.type === 'TripStop').length + 1
                : -1,
            directions: {
              distance: 0,
              previous: geoJson || {}, //TODO populate these fields with a call to the directions api
              next: {},
            },
            infos: {
              relatedToPlace:
                type === 'PlaceOfInterest'
                  ? getPlaceClosest(places, $event)
                  : undefined,
            },
            location: $event.location,
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
