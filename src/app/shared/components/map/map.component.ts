import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
} from '@angular/core';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { FeatureCollection } from 'geojson';
import * as L from 'leaflet';
import * as _ from 'lodash';
import { BehaviorSubject, Observable, map, tap } from 'rxjs';
import { Place } from 'src/app/dashboard/models/places';

const iconRetinaUrl = 'assets/marker-icon-2x.png';
const iconUrl = 'assets/marker-icon.png';
const shadowUrl = 'assets/marker-shadow.png';
export const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
});
L.Marker.prototype.options.icon = iconDefault;

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.sass'],
})
export class MapComponent implements AfterViewInit {
  @Input() set markers(t: L.Marker[]) {
    this.markersState.next(t);
  }
  @Input() set directions(t: GeoJSON.FeatureCollection | null) {
    this.directionsState.next(t);
  }
  private directionsState =
    new BehaviorSubject<GeoJSON.FeatureCollection | null>(null);
  private markersState = new BehaviorSubject<L.Marker[]>([]);

  private map: L.Map | null = null;
  public options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        // attribution: '',
      }),
    ],
    zoom: 5,
    center: L.latLng(46.879966, -121.726909),
  };

  directions$ = this.directionsState.pipe(
    map((x) => {
      if (x === null) return [];

      return [L.geoJSON(x, {})];
    })
  );
  layers$: Observable<L.Marker[]> = this.markersState.asObservable().pipe(
    tap({
      next: (val) => {
        if(this.map === null) return;
        const bounds = new L.LatLngBounds(val.map(x => {
          const r = x.getLatLng();
          return [r.lat, r.lng]
          }))
        this.map.fitBounds(bounds);
        console.log('New value for markers');
        console.log(val);
      },
    })
  );
  constructor() {}

  ngAfterViewInit(): void {
    // this.initMap();
  }
  onMapReady(map: L.Map) {
    this.map = map;
    setTimeout(() => map.invalidateSize(), 0);
  }
}
