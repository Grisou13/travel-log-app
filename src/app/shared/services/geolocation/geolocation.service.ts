import { Injectable } from '@angular/core';

const browserHasApi = 'geolocation' in navigator;

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {

  constructor() { }

  getCurrentPosition(options: PositionOptions = {timeout:5000, enableHighAccuracy:true}): Promise<GeolocationPosition> {
    return new Promise((resolve, reject) => {
      if(!browserHasApi) {
        reject("Geolocation not available");
      }
      navigator.geolocation.getCurrentPosition(resolve, reject, options);
    })
  };

}
