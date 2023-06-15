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
import { Point } from 'geojson';

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
  @Output() selectedCity = new EventEmitter<Result>();

  protected inputSearch = '';
  protected search$ = new BehaviorSubject('');
  protected loading$ = new BehaviorSubject(false);
  cities$ = this.search$.pipe(
    tap((x) => (this.inputSearch = x)),
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
    this.inputSearch = city.matching_full_name;
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
      );
  }
}
