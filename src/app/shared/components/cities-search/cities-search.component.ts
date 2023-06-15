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
import { SearchService } from '@httpClients/open-route-service/search/search.service';
import { GeocodeResponse } from '@httpClients/open-route-service/search/types';

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
    this.searchTerm = term;
    this.search$.next(term);
  }
  @Output() selectedCity = new EventEmitter<Result>();
  public searchTerm = '';
  protected search$ = new BehaviorSubject(this.searchTerm);
  protected loading$ = new BehaviorSubject(false);

  cities$ = this.search$.pipe(
    debounceTime(450),
    filter((x) => x.trim().length > 3),
    distinctUntilChanged(),

    switchMap((query) =>
      this.searchService
        .autocomplete({
          text: query,
          size: 5,
          layers: ['locality'],
        })
        .pipe(indicate(this.loading$))
    ),
    tap(console.debug),
    map((res) => {
      return res.features;
    })
  );

  constructor(
    private cityService: CitiesService,
    private urbanAreaService: UrbanAreasService,
    private searchService: SearchService
  ) {}
  resolveCity(city: GeocodeResponse['features'][0]) {
    this.searchTerm = city.properties.label;
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
