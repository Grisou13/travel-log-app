import { Component, Input, NgZone } from '@angular/core';
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
  merge,
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
import { DirectionRequest } from '@httpClients/open-route-service/directions/schema';


@Component({
  selector: 'app-trip-map',
  templateUrl: './trip-map.component.html',
  styleUrls: ['./trip-map.component.sass']
})
export class TripMapComponent {
    constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService,
    private directionService: DirectionsService,
    private zone: NgZone
  ) {}


  @Input({required: true}) set trip (t: Trip) {
    this.tripState.next(t)
  }
  private tripState = new BehaviorSubject<Trip | null>(null);

  places$ = this.tripState.asObservable().pipe(
    switchMap(trip => {
      if(trip === null) return EMPTY;

      return combineLatest([of(trip), this.placeService.fetchForTrip(trip)]);
    }),
    switchMap(([trip, places]) => {
      console.log("Got places from api");
      console.log(places);
      //doing this is pretty stupid, but for now it will work.
      // the idea is that fetchFor trip does not bring us from the cacheed items and will never emit a new value.
      // what we need here is an operator that allows us to add/update stuff and has an internal cache of it's own.
      // this allows us to keep the fetch for trip to be 
      if(places.length <= 0) return of([]);
      const tripId = trip.id;
      if(tripId === undefined) return of([]);
      console.log("Filtering for tripId: ", tripId)
      return this.placeService.items$.pipe(map(items => {
        console.log("Items in cache: ", items);
        return items.filter(i => i.tripId === tripId)
      }))
    }),
    // distinctUntilChanged(),
    // shareReplay({refCount: true, bufferSize: 1})
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
      return this.directionService.fetchDirectionsGeoJson(DirectionRequest.parse({
        coordinates: waypoints,
        extra_info: ['tollways','roadaccessrestrictions']
      }));
    }),
    map(geoJson => {
      if(geoJson === null) return null;

      const geojsonLayer =  new L.GeoJSON(geoJson, {onEachFeature: (feature, layer) => {
        const popup = L.popup({content: "Hi there"})
        layer.bindPopup(popup);
        
        layer.on("mouseover", function(e){

          console.log("Moused over geo json layer: ")
          e.target.setStyle({wight: 10, color: "#333"})
          layer.openPopup()
          console.log(e)
          console.log(feature);
          console.log(layer)
          console.log("===============")
        })
        layer.on("click", function(e){
          console.log("CLicked feature")
          layer.openPopup();
        })
        
      }})
      return geojsonLayer
    }),
    startWith(null),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  layers$ = combineLatest([this.markers$, this.directions$]).pipe(
    map(([markers, directions]) => ({ markers, directions }))
  );
}
