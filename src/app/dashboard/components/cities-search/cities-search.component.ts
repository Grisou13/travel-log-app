import { CitiesService } from '@httpClients/teleport/api/cities.service';
import { Component, EventEmitter, Output } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  concat,
  debounceTime,
  distinctUntilChanged,
  filter,
  map,
  of,
  startWith,
  switchMap,
  tap,
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

export type CitySearchResult = City & {
  pictures?: Array<Photo>;
};

@Component({
  selector: 'app-cities-search',
  templateUrl: './cities-search.component.html',
  styleUrls: ['./cities-search.component.sass'],
})
export class CitiesSearchComponent {
  @Output() selectedCity = new EventEmitter<CitySearchResult>();

  protected search$ = new BehaviorSubject('');
  protected loading$ = new BehaviorSubject(false);
  cities$ = this.search$.pipe(
    debounceTime(200),
    filter((x) => x.length > 3),
    distinctUntilChanged(),
    switchMap((query) =>
      this.cityService
        .searchCities(query, 10, [
          'city:search-results/city:item',
          'city:search-results/city:item/city:urban_area',
        ])
        .pipe(tap(console.log), indicate(this.loading$))
    ),
    map((res) => {
      return res._embedded['city:search-results'];
    })
  );

  constructor(
    private cityService: CitiesService,
    private urbanAreaService: UrbanAreasService
  ) {}
  resolveCity(city: CitySearchResults['_embedded']['city:search-results'][0]) {
    const baseCity = city._embedded['city:item'];
    this.urbanAreaService
      .getUrbanAreaImages(baseCity._embedded['city:urban_area'].ua_id)
      .pipe(
        tap((pictures) => {
          this.selectedCity.emit({ ...baseCity, pictures: pictures.photos });
        })
      );
  }
}
