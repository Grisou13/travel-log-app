import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  OnInit,
  Output,
} from '@angular/core';
import { Point } from 'geojson';
import { Result } from '../cities-search/cities-search.component';
import {
  BehaviorSubject,
  catchError,
  combineLatest,
  map,
  of,
  retry,
  switchMap,
  tap,
} from 'rxjs';
import { iconDefault } from '../map/map.component';
import * as L from 'leaflet';
import { SearchService } from '@httpClients/open-route-service/search/search.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: [],
})
export class LocationSearchComponent {
  constructor(private searchService: SearchService) {}
  @Input() extraMarkers: L.Marker[] = [];

  private mapClickedState = new BehaviorSubject<L.Marker | null>(null);
  searchedText = '';

  resolveOnMapClicked$ = this.mapClickedState
    .pipe(
      switchMap((marker) => {
        if (marker === null) return of(null);
        return combineLatest([
          of(marker),
          this.searchService
            .reverseGeocode({
              layers: ['locality', 'localadmin'],
              'point.lat': marker.getLatLng().lat,
              'point.lon': marker.getLatLng().lng,
              'boundary.circle.radius': 100,
            })
            .pipe(
              tap({
                next: (res) => {
                  if (res === null) return;
                  const result = res.features[0];
                  if (result === null) return;
                  if (typeof result.properties === 'undefined') return;
                  this.searchedText = result.properties.label;

                  this.locationSelected.emit({
                    name: result.properties.label,
                    pictureUrl: '',
                    location: {
                      type: 'Point',
                      coordinates: [
                        result.geometry.coordinates[1],
                        result.geometry.coordinates[0],
                      ],
                    },
                  });
                },
              })
            ),
        ]).pipe(
          catchError((err) => of(null)),
          retry({ delay: () => this.mapClickedState.asObservable() })
        );
      }),
      takeUntilDestroyed()
    )
    .subscribe();
  private markersState = new BehaviorSubject<L.Marker | null>(null);

  markers$ = combineLatest([
    this.markersState.asObservable(),
    this.mapClickedState.asObservable(),
  ]).pipe(
    map(
      ([markers, newMarkerOnMap]) =>
        [markers, newMarkerOnMap, ...this.extraMarkers].filter(
          (x) => x !== null
        ) as L.Marker[]
    )
  );

  mapSelected($event: Point) {
    this.mapClickedState.next(
      L.marker([$event.coordinates[1], $event.coordinates[0]], {
        icon: iconDefault(``),
        title: `You selected here!`,
      })
    );
  }
  @Output() locationSelected = new EventEmitter<Result>();

  placeSelected($event: Result) {
    this.mapClickedState.next(null);
    this.markersState.next(
      L.marker(
        [$event.location.coordinates[1], $event.location.coordinates[0]],
        { icon: iconDefault() }
      )
    );
    this.locationSelected.emit($event);
  }
}
