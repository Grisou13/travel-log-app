import { CitiesService } from '@httpClients/teleport/api/cities.service';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  catchError,
  concat,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  retry,
  retryWhen,
  startWith,
  switchMap,
  tap,
  throwError,
} from 'rxjs';
import { indicate } from 'src/app/helpers';
import {
  City,
  CitySearchResults,
  Photo,
  UrbanArea,
  UrbanAreasService,
} from '@httpClients/teleport';
import { CommonModule } from '@angular/common';
import { Point } from 'geojson';
import { SearchService } from '@httpClients/open-route-service/search/search.service';
import { GeocodeResponse } from '@httpClients/open-route-service/search/types';
import { FormControl, Validators } from '@angular/forms';
import { GeolocationService } from '@shared/services/geolocation/geolocation.service';

export type CitySearchResult = City & {
  pictures?: Array<Photo>;
};

export type Result = {
  name: string;
  location: Point;
  pictureUrl: string | undefined;
};

@Component({
  selector: 'app-cities-search',
  templateUrl: './cities-search.component.html',
  styleUrls: ['./cities-search.component.sass'],
})
export class CitiesSearchComponent {
  search(term: string) {
    this.searchValue = term;
  }
  @Output() selectedCity = new EventEmitter<Result>();
  // the only reason we use this
  public searchValue = '';
  searchSubject = new BehaviorSubject('');

  cities$ = this.searchSubject.asObservable().pipe(
    debounceTime(100),
    distinctUntilChanged(),
    tap({
      next: (v) => {
        this.searchValue = v;
        console.log('New input status: ', v);
      },
    }),
    filter((x) => this.inputValid(x)),
    switchMap((query) =>
      this.searchService.autocomplete({
        text: query,
        size: 5,
        layers: ['locality'],
      })
    ),
    catchError((err) =>
      concat(
        of([]),
        throwError(() => new Error(err))
      )
    ),
    retry({ delay: () => this.searchSubject.asObservable() }),
    tap(console.debug),
    map((res: GeocodeResponse) => res.features)
  );

  constructor(
    private searchService: SearchService,
    private geoService: GeolocationService
  ) {}
  geolocateUser() {
    this.geoService
      .getCurrentPosition()
      .then((pos) => console.log(pos))
      .catch((error) => console.error(error));
  }
  geolocateFromAutoComplete() {
    this.geoService
      .getCurrentPosition()
      .then((pos) => console.log(pos))
      .catch((error) => console.error(error));
  }

  inputValid(val: string = '') {
    return val.length >= 3;
  }
  resolveCity(city: GeocodeResponse['features'][0]) {
    this.searchValue = city.properties.label; //.setValue(city.properties.label, { emitEvent: false });
    this.selectedCity.emit({
      name: city.properties.label,
      location: city.geometry,
      pictureUrl: '', // pictures.photos?.at(0)?.image.web,
    });
    /*this.inputSearch = city.matching_full_name;
    const baseCity = city._embedded['city:item'];
    this.urbanAreaService
      .getUrbanAreaImages(baseCity._embedded['city:urban_area'].ua_id)
      .pipe(
        tap((pictures) => {
          this.selectedCity.emit({
            name: baseCity.full_name,
            location: {
              type: 'Point',
              coordinates: [
                baseCity.location.latlon.longitude,
                baseCity.location.latlon.latitude,
              ],
            },
            pictureUrl: pictures.photos?.at(0)?.image.web,
          });
        })
      );*/
  }
}
