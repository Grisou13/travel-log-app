import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Input,
  NgZone,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
} from '@angular/core';
import { LeafletControlLayersConfig } from '@asymmetrik/ngx-leaflet';
import { GeolocationService } from '@shared/services/geolocation/geolocation.service';
import { FeatureCollection, Point } from 'geojson';
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
  @Output() onClicked = new EventEmitter<Point>();

  @Input() set markers(t: L.Marker[]) {
    this.markersState.next(t);
  }
  @Input() set directions(t: L.GeoJSON<any>[] | null) {
    this.directionsState.next(t);
  }
  private directionsState = new BehaviorSubject<L.GeoJSON<any>[] | null>(null);
  private markersState = new BehaviorSubject<L.Marker[]>([]);

  private map: L.Map | null = null;
  public geoStatus: any | null = null;

  public options = {
    layers: [
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        minZoom: 3,
        maxZoom: 18,
        // attribution: '',
      }),
    ],
    zoom: 5,
    zoomControl: false,
    center: L.latLng(46.879966, -121.726909),
  };

  directions$ = this.directionsState.pipe(
    map((x) => {
      if (x === null) return [];

      return [...x];
    })
  );
  layers$: Observable<L.Marker[]> = this.markersState.asObservable().pipe(
    tap({
      next: (val) => {
        if (this.map === null) return;
        if (val.length <= 0) return;
        const bounds = new L.LatLngBounds(
          val.map((x) => {
            const r = x.getLatLng();
            return [r.lat, r.lng];
          })
        );
        this.map.fitBounds(bounds);
        console.log('New value for markers');
        console.log(val);
      },
    })
  );

  constructor(private geoService: GeolocationService, private zone: NgZone) {}

  ngAfterViewInit(): void {
    // this.initMap();
  }
  async onMapReady(map: L.Map) {
    this.map = map;
    this.map.addControl(L.control.zoom({ position: 'bottomright' }));
    setTimeout(() => map.invalidateSize(), 0);
    // await this.initGeolocation();

    this.map.on('click', (event) => {
      this.zone.run(() => {
        this.onClicked.emit({
          type: 'Point',
          coordinates: [
            event.latlng.lng,
            event.latlng.lat,
            event.latlng?.alt ?? 0,
          ],
        });
      });
    });
  }

  async initGeolocation() {
    const geoStatus = await this.geoService.checkNavigatorGeolocation();
    this.geoStatus = geoStatus;

    if (geoStatus === 'denied') {
      return;
    }
    await this.showUserLocation(this.map);
  }

  async showUserLocation(map: L.Map | null) {
    if (map === null) return;

    const position = await this.geoService.getUserPosition();
    if (position === null) return;

    map.setView([position.coords.latitude, position.coords.longitude], 8);

    const icon = L.icon({
      iconUrl: '/assets/pin.png',
      iconSize: [48, 48],
      iconAnchor: [24, 42],
      popupAnchor: [0, -32],
    });

    const marker = L.marker(
      [position.coords.latitude, position.coords.longitude],
      {
        icon,
      }
    ).bindPopup('You are here!');
    marker.addTo(map);
  }
}
