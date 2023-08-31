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
/* export const iconDefault = L.icon({
  iconRetinaUrl,
  iconUrl,
  shadowUrl,
  iconSize: [25, 41],
  iconAnchor: [13, 41],
  popupAnchor: [1, -34],
  tooltipAnchor: [16, -28],
  shadowSize: [41, 41],
}); */
export const iconDefault = (html = '') =>
  L.divIcon({
    className: 'place-icon',
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [18, 0],
    tooltipAnchor: [18, 0],
  });

export const iconPoi = (html = '') =>
  L.divIcon({
    className: 'poi-icon',
    html,
    iconSize: [36, 36],
    iconAnchor: [18, 18],
    popupAnchor: [18, 0],
    tooltipAnchor: [18, 0],
  });
L.Marker.prototype.options.icon = iconDefault();

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
  @Input() center: L.LatLng = L.latLng(46.879966, -121.726909);
  @Input() bbox: L.LatLngBounds | null = null;
  @Output() centerChanged = new EventEmitter<L.LatLng>();
  @Output() bboxChanged = new EventEmitter<L.LatLngBounds>();
  private directionsState = new BehaviorSubject<L.GeoJSON<any>[] | null>(null);
  private markersState = new BehaviorSubject<L.Marker[]>([]);

  private map: L.Map | null = null;
  geoStatus: any | null = null;
  geoDenied: boolean | null = null;
  geoGranted: boolean | null = null;

  _options = {
    layers: [
      L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          minZoom: 3,
          maxZoom: 18,
          // attribution: '',
        }
      ),
    ],
    zoom: 5,
    zoomControl: false,
    center: L.latLng(46.879966, -121.726909),
  };

  getOptions() {
    return { ...this._options, center: this.center };
  }

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
        console.debug('New value for markers');
        console.debug(val);
      },
    })
  );

  constructor(private geoService: GeolocationService, private zone: NgZone) {}

  ngAfterViewInit(): void {
    // this.initMap();
  }
  async onMapReady(map: L.Map) {
    this.map = map;
    this.map.on('dragend', () =>
      this.zone.run(() => {
        this.centerChanged.emit(this.map?.getCenter());
        this.bboxChanged.emit(this.map?.getBounds());
      })
    );
    this.map.addControl(L.control.zoom({ position: 'bottomright' }));
    this.map.addControl(
      L.control.scale({ metric: true, imperial: false }).addTo(map)
    );
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
    const geoStatusResponse = await this.geoService.checkNavigatorGeolocation();
    this.geoStatus = geoStatusResponse;

    if (geoStatusResponse === 'denied') {
      this.geoDenied = true;
      return;
    }
    this.geoGranted = true;
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
      tooltipAnchor: [0, -28],
    });

    const marker = L.marker(
      [position.coords.latitude, position.coords.longitude],
      {
        icon,
      }
    ).bindTooltip('You are here!');
    marker.addTo(map);
  }
}
