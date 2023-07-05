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

function distance(
  first: GeoJSON.Point,
  second: GeoJSON.Point,
  unit: 'K' | 'N' = 'K'
) {
  const [lat1, lon1] = first.coordinates;
  const [lat2, lon2] = second.coordinates;
  var radlat1 = (Math.PI * lat1) / 180;
  var radlat2 = (Math.PI * lat2) / 180;
  var theta = lon1 - lon2;
  var radtheta = (Math.PI * theta) / 180;
  var dist =
    Math.sin(radlat1) * Math.sin(radlat2) +
    Math.cos(radlat1) * Math.cos(radlat2) * Math.cos(radtheta);
  if (dist > 1) {
    dist = 1;
  }
  dist = Math.acos(dist);
  dist = (dist * 180) / Math.PI;
  dist = dist * 60 * 1.1515;
  if (unit == 'K') {
    dist = dist * 1.609344;
  }
  if (unit == 'N') {
    dist = dist * 0.8684;
  }
  return dist;
}

function getPlaceClosest(places: Place[], $event: Result): string {
  const distances = places.reduce((acc, cur) => {
    acc.push({ id: cur.id, dist: distance($event.location, cur.location) });
    return acc;
  }, [] as { id: string; dist: number }[]);
  const sorted = _.sortBy(distances, 'dist');
  return _.first(sorted)?.id || '-1';
}

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.sass'],
})
export class TripDetailComponent {
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService,
    private directionService: DirectionsService,
    private zone: NgZone
  ) {}

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
    // switchMap((_) => this.placeService.items$),
    tap({
      next: (p) => {
        console.log('Places new items');
        console.log(p);
      },
    }),
    distinctUntilChanged((p, c) => _.isEqual(p, c)),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  tripStops$ = this.places$.pipe(
    map((x) => x.filter((y) => y.type === 'TripStop'))
  );

  placesAsMarkers$ = this.tripStops$.pipe(
    map((x) => {
      return x.map((y) =>
        L.marker([y.location.coordinates[1], y.location.coordinates[0]], {
          icon: iconDefault,
          title: y.name,
        })
          .bindTooltip(y.name)
          .addEventListener('click', () => {
            console.log('CLicking on:', y);
            this.zone.run(() => {
              const currentlySelected = this.selectedPlaceState.getValue();

              if (currentlySelected === null) {
                this.selectedPlaceState.next(y);
                return;
              }
              if (currentlySelected.id === y.id) {
                this.selectedPlaceState.next(null);
                return;
              }
            });

            //this.selectedPlaceState.next(y);
          })
      );
    })
  );

  private selectedPlaceState = new BehaviorSubject<Place | null>(null);
  selectedPlace$ = this.selectedPlaceState.asObservable(); /*.pipe(
    startWith(null),
    pairwise(),
    map(([previous, current]) => {
      if (previous === null) return current;
      if (current === null) return current;

      if (previous.id === current.id) return null;
      return current;
    })
  );*/
  poi$ = combineLatest([this.selectedPlace$, this.places$]).pipe(
    map(([selectedPlace, places]) => {
      if (selectedPlace === null) return [];
      return (
        places.filter((x) => x.infos?.relatedToPlace === selectedPlace.id) || []
      );
    })
  );
  markers$: Observable<L.Marker[]> = combineLatest([
    this.poi$.pipe(
      map((pois) => {
        if (!Array.isArray(pois)) return [];

        return pois.map((x) =>
          L.marker([x.location.coordinates[1], x.location.coordinates[0]], {
            title: x.name,
          }).bindTooltip(x.name)
        );
      })
    ),
    this.placesAsMarkers$,
  ]).pipe(
    map(([pois, places]) => [...pois, ...places]),
    shareReplay({ refCount: true, bufferSize: 1 })
  );

  directions$ = this.tripStops$.pipe(
    map((stops) => {
      if (stops === null) return [];
      if (stops.length < 2) {
        return [];
      }
      return stops;
    }),
    switchMap((stops) => {
      if (stops.length <= 0) return of(null);
      const waypoints = _.sortBy(stops, 'order').map(
        (s) => s.location.coordinates
      );
      console.log("Stops for the trip: ", stops)
      console.log("Getting waypoints for directions: ", waypoints)
      return this.directionService.fetchDirectionsGeoJson({
        type: 'MultiPoint',
        coordinates: waypoints,
      });
    }),
    map(geoJson => {
      if(geoJson === null) return null;

      return new L.GeoJSON(geoJson, {onEachFeature: (feature, layer) => {
        layer.on("mouseover", function(e){
          console.log(e)
          console.log(feature);
        })
      }})
    }),
    startWith(null),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  layers$ = combineLatest([this.markers$, this.directions$]).pipe(
    map(([markers, directions]) => ({ markers, directions }))
  );
  public placeType = new FormControl<PlaceType>('TripStop', []);
  addPlace($event: Result) {
    zip([this.trip$, this.places$])
      .pipe(
        switchMap(([trip, places]) => {
          if (trip === null) return of(null);
          return this.placeService.add({
            name: $event.name,
            tripId: trip.id,
            description: 'Stop at ' + $event.name,
            type:
              this.placeType.value === null ? 'TripStop' : this.placeType.value,
            startDate: new Date(),
            order: places.length - 1 || -1,
            directions: {
              distance: 0,
              previous: {},
              next: {},
            },
            infos: {
              relatedToPlace:
                this.placeType.value !== null &&
                this.placeType.value === 'PlaceOfInterest'
                  ? getPlaceClosest(places, $event)
                  : '-1',
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
