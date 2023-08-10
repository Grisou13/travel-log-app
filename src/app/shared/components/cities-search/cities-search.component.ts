import { Component, EventEmitter, Input, Output } from '@angular/core';
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
import { ArrayElement, indicate } from 'src/app/helpers';
import { CommonModule } from '@angular/common';
import { Point } from 'geojson';
import { SearchService } from '@httpClients/open-route-service/search/search.service';
import { GeocodeResponse } from '@httpClients/open-route-service/search/types';
import { FormControl, Validators } from '@angular/forms';
import { GeolocationService } from '@shared/services/geolocation/geolocation.service';

export type Result = {
  name: string;
  location: Point;
  pictureUrl: string | undefined;
};

type x = ArrayElement<GeocodeResponse['features']>;

@Component({
  selector: 'app-cities-search',
  templateUrl: './cities-search.component.html',
  styleUrls: [],
})
export class CitiesSearchComponent {
  search(term: string) {
    this.searchValue = term;
  }
  @Input() set initialValue(val: string) {
    this.searchValue = val;
    this.selected = undefined;
  }
  @Output() selectedCity = new EventEmitter<Result>();
  // the only reason we use this
  public searchValue = '';
  private selected:
    | ArrayElement<GeocodeResponse['features']>
    | null
    | undefined = undefined;

  searchSubject = new BehaviorSubject('');

  cities$ = this.searchSubject.asObservable().pipe(
    debounceTime(150),
    distinctUntilChanged(),
    tap({
      next: (v) => {
        this.searchValue = v;
        this.selected = null;
        console.debug('New input status: ', v);
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
        of([])
        //throwError(() => new Error(err))
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

  inputValid(val: string = '') {
    return val.length >= 3;
  }
  resolveCity(city: GeocodeResponse['features'][0]) {
    this.searchValue = city.properties.label;
    this.selected = city;
    this.selectedCity.emit({
      name: city.properties.label,
      location: city.geometry,
      pictureUrl: '', // pictures.photos?.at(0)?.image.web,
    });
  }
  showList() {
    return (
      this.inputValid(this.searchValue) &&
      (this.selected === null || this.selected === undefined)
    );
  }
  shouldShowLoading() {
    return this.inputValid(this.searchValue) && this.selected !== undefined;
  }
}
