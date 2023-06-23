import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  Observable,
  concatMap,
  forkJoin,
  map,
  of,
  share,
  switchMap,
  tap,
  withLatestFrom,
} from 'rxjs';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trips';
import { DirectionsService } from '@httpClients/open-route-service/directions/directions.service';
import { PlaceService } from '../../services/place.service';
import { Point } from 'geojson';
import { Result } from '@shared/components/cities-search/cities-search.component';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.sass'],
})
export class TripDetailComponent {
  trip$: Observable<Trip | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id') || null;
      if (id === null) return of(null);
      return this.tripService.get(id);
    })
  );
  places$ = this.trip$.pipe(
    switchMap((trip) => {
      if (trip === null) return of([]);
      return this.placeService.fetchForTrip(trip);
    }),
    switchMap((_) => this.placeService.items$),
    tap({
      next: (p) => {
        console.log('Places new items');
        console.log(p);
      },
    }),
    share()
  );
  placesAsMarkers$ = this.places$.pipe(
    map((x) => {
      return x.flatMap((y) => y.location) as Point[];
    })
  );

  directions$ = this.places$.pipe(
    switchMap((places) => {
      if (places === null) return of([]);
      const stops = places.filter((x) => x.type === 'TripStop');
      if (stops.length < 2) {
        return of(null);
      }
      const waypoints = stops.map((s) => s.location.coordinates);
      const directions = this.directionService.fetchDirections({
        type: 'MultiPoint',
        coordinates: waypoints,
      });
      return directions;
    })
  );
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService,
    private directionService: DirectionsService
  ) {}

  addPlace($event: Result) {
    this.trip$
      .pipe(
        switchMap((trip) => {
          if (trip === null) return of(null);
          return this.placeService.add({
            name: $event.name,
            tripId: trip.id,
            description: 'Stop at ' + $event.name,
            type: 'TripStop',
            startDate: new Date(),
            order: trip?.placesCount || -1,
            directions: {
              distance: 0,
              previous: {},
              next: {},
            },
            location: $event.location,
          });
        })
      )
      .subscribe({
        next: console.log,
        complete: console.log,
        error: console.error,
      });
  }
}
