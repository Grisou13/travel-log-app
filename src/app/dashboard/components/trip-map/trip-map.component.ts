import { Component, Input, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import {
  BehaviorSubject,
  EMPTY,
  Observable,
  combineLatest,
  distinctUntilChanged,
  forkJoin,
  map,
  of,
  shareReplay,
  startWith,
  switchMap,
  tap,
} from 'rxjs';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trips';
import { DirectionsService } from '@httpClients/open-route-service/directions/directions.service';
import { PlaceService } from '../../services/place.service';
import { iconDefault } from '@shared/components/map/map.component';
import * as L from 'leaflet';
import * as _ from 'lodash';
import { Place } from '../../models/places';
import { DirectionRequest } from '@httpClients/open-route-service/directions/schema';
import { distConverter, timeConverter } from '../../helpers';

@Component({
  selector: 'app-trip-map',
  templateUrl: './trip-map.component.html',
  styleUrls: [],
})
export class TripMapComponent {
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService,
    private placeService: PlaceService,
    private directionService: DirectionsService,
    private zone: NgZone
  ) {}

  @Input({ required: true }) set trip(t: Trip) {
    this.tripState.next(t);
  }
  private tripState = new BehaviorSubject<Trip | null>(null);

  places$ = this.tripState.asObservable().pipe(
    switchMap((trip) => {
      if (trip === null) return EMPTY;
      return this.placeService.fetchForTrip(trip);
    }),
    distinctUntilChanged(),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  tripStops$ = this.places$.pipe(
    map((x) => x.filter((y) => y.type === 'TripStop'))
  );

  placesAsMarkers$ = this.tripStops$.pipe(
    map((x) => {
      return x.map((y) =>
        L.marker([y.location.coordinates[1], y.location.coordinates[0]], {
          icon: iconDefault(`${y.order}`),
          title: y.name,
          // draggable: true,
        })
          .bindTooltip(y.name)
          .addEventListener('click', () => {
            console.debug('CLicking on:', y);
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
      return _.sortBy(stops, 'order');
    }),
    switchMap((stops) => {
      if (stops.length <= 0) return of(null);
      return forkJoin(
        stops.map((s, index) => {
          //if we have directions we good
          if (
            typeof s.directions !== 'undefined' &&
            typeof s.directions.previous !== 'undefined' &&
            s.directions.previous !== null
          ) {
            return of(s.directions.previous as GeoJSON.FeatureCollection);
          }
          // we can't get previous if this is index 0
          if (index <= 0) return of(null);

          const previous = stops[index - 1];
          const waypoints = [
            previous.location.coordinates,
            s.location.coordinates,
          ];
          console.debug('Stops for the trip: ', s);
          console.debug('Getting waypoints for directions: ', waypoints);
          return this.directionService
            .fetchDirectionsGeoJson(
              DirectionRequest.parse({
                coordinates: waypoints,
                extra_info: ['tollways', 'roadaccessrestrictions'],
              })
            )
            .pipe(
              switchMap((result) => {
                const payload = {
                  ...s,
                  directions: {
                    previous: result,
                  },
                };
                return this.placeService
                  .update(s.id, payload)
                  .pipe(
                    tap({
                      next: (val) => {
                        console.debug('Updated place in api ', val);
                      },
                    })
                  )
                  .pipe(map((_) => result));
              })
            );
        })
      );
    }),
    map((geoJsons) => {
      if (geoJsons === null) return null;
      return geoJsons
        .filter((x) => x != null)
        .map((geoJson) => {
          const geojsonLayer = new L.GeoJSON(geoJson!, {
            style: {
              weight: 3,
              color: 'rgba(var(--ui-button-color),1)',
            },
            onEachFeature: (feature, layer) => {
              const popup = L.popup({
                content: `<b>Stop to stop informations:</b><br>
                Distance: ${distConverter(
                  feature.properties.summary.distance
                )}<br>
                Duration: ${timeConverter(
                  feature.properties.summary.duration
                )}`,
              });
              layer.bindPopup(popup);

              layer.on('mouseover', function (e) {
                console.debug('Moused over geo json layer: ');
                e.target.setStyle({
                  weight: 7,
                  color: 'rgba(var(--ui-button-color),1)',
                });
                layer.openPopup();
                console.debug(e);
                console.debug(feature);
                console.debug(layer);
                console.debug('===============');
              });
              layer.on('click', (e) => {
                console.debug('CLicked feature');
                if (layer.isPopupOpen()) {
                  geojsonLayer.resetStyle(e.target);
                } else {
                  e.target.setStyle({
                    weight: 7,
                    color: 'rgba(var(--ui-button-color),1)',
                  });
                }
                layer.togglePopup();
              });
              layer.on('mouseout', function (e) {
                geojsonLayer.resetStyle(e.target);
                layer.closePopup();
              });
            },
          });
          return geojsonLayer;
        });
    }),
    startWith(null),
    shareReplay({ refCount: true, bufferSize: 1 })
  );
  layers$ = combineLatest([this.markers$, this.directions$]).pipe(
    map(([markers, directions]) => ({ markers, directions }))
  );
}
