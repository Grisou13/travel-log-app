import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';

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
  getUserPosition(options: PositionOptions = {timeout:500, enableHighAccuracy:true}): Observable<GeolocationPosition> {
    return new Observable((observer: Subscriber<any>) => {
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
          observer.next({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          })
          //console.log(`this user position: ${pos.coords.latitude}, ${pos.coords.longitude}`)
        })
      } else {
        observer.error();
      }
    })
  }
}
