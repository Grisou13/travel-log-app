import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

const browserHasGeoApi = 'geolocation' in navigator;

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  constructor(private toastr: ToastrService) {}

  // testing way to get state to switch geoloca button class
  async checkNavigatorGeolocation() {
    !browserHasGeoApi
      ? this.toastr.error(`No geolocation available on this browser!`)
      : this.toastr.info(`Geolocation is available on this browser!`);
    const geoStatus = await navigator.permissions.query({
      name: 'geolocation',
    });

    // console.log(geoStatus)
    return geoStatus.state;
  }

  async getUserPosition(
    options: PositionOptions = { timeout: 5000 }
  ): Promise<GeolocationPosition | null> {
    return new Promise((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(
        (pos) => resolve(pos),
        (err) => {
          console.error(err);
          reject(err);
        },
        options
      );
    });
  }
}
