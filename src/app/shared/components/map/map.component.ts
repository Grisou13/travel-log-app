import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import * as L from 'leaflet';

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
  @Input() markers: L.Marker[] = [];
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

  constructor() {}
  getMarkers() {
    return this.markers.map((x) =>
      L.marker(x.getLatLng(), { icon: iconDefault })
    );
  }
  ngAfterViewInit(): void {
    // this.initMap();
  }
  onMapReady(map: L.Map) {
    setTimeout(() => map.invalidateSize(), 0);
  }
}
