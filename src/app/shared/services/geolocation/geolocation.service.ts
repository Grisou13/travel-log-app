import { Injectable } from '@angular/core';
import { Observable, Subscriber } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

const browserHasGeoApi = 'geolocation' in navigator;

@Injectable({
  providedIn: 'root',
})
export class GeolocationService {
  
  constructor(
    private toastr: ToastrService,
  ) { }

  // testing way to get state to switch geoloca button class
  async checkNavigatorGeolocation(){
    (!browserHasGeoApi)
    ?
      this.toastr.error(`No geolocation available on this browser!`)
    :
      this.toastr.info(`Geolocation is available on this browser!`);
      const geoStatus = await navigator.permissions.query({ name: 'geolocation' }).then((result) => {return result.state;});
      // console.log(geoStatus)
      return geoStatus
  }
  
  getUserPosition(options: PositionOptions = {timeout:5000}): Observable<GeolocationPosition> {
    return new Observable((observer: Subscriber<any>) => {

/*       if (!navigator.geolocation) {
        observer.error();
        return;
      }
      if (navigator.permissions && !navigator.permissions.query({name:'geolocation'})) {
        observer.error();
        return;
      }
      navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
        observer.next({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      }) */

      navigator.permissions && navigator.permissions.query({name:'geolocation'}).then((result) => {
        if (result.state === 'denied'){
          this.toastr.error(`You denied the geolocation`);
          observer.error();
        }
        if (result.state === 'prompt' || result.state === 'granted'){
          navigator.geolocation.getCurrentPosition((position: GeolocationPosition) => {
            observer.next({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            })
          })
        }
      })
    })
  }
  
}
