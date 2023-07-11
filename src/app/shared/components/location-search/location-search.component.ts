import { Component, EventEmitter, Output } from '@angular/core';
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

@Component({
  selector: 'app-location-search',
  templateUrl: './location-search.component.html',
  styleUrls: ['./location-search.component.sass'],
})
export class LocationSearchComponent {
  constructor(private searchService: SearchService) {}
  private markersState = new BehaviorSubject<L.Marker | null>(null);

  markers$ = this.markersState.asObservable().pipe(
    switchMap((marker) => {
      if (marker === null) return of(null);
      return combineLatest([
        of(marker),
        this.searchService.reverseGeocode({
          layers: ['locality', 'localadmin'],
          'point.lat': marker.getLatLng().lat,
          'point.lon': marker.getLatLng().lng,
        }),
      ]).pipe(
        catchError((err) => of(null)),
        retry({ delay: () => this.markersState.asObservable() }),
        tap({
          next: (res) => {
            if (res === null) return;
            const result = res[1].features[0];
            if (result === null) return;

            this.locationSelected.emit({
              name: result.properties.label,
              pictureUrl: '',
              location: {
                type: 'Point',
                coordinates: result.geometry.coordinates,
              },
            });
          },
        })
      );
    }),
    map((res) => {
      if (res === null) return [];
      const marker = res[0];
      if (marker === null) return [];
      if (typeof marker === 'undefined') return [];

      return [marker];
    })
  );

  mapSelected($event: Point) {
    this.markersState.next(
      L.marker([$event.coordinates[1], $event.coordinates[0]], {
        icon: iconDefault,
        title: `You selected here!`,
      })
    );
  }
  @Output() locationSelected = new EventEmitter<Result>();

  placeSelected($event: Result) {
    this.locationSelected.emit($event);
  }
}
