import { CitiesService } from './../../httpClients/teleport/api/cities.service';
import { Component } from '@angular/core';
import {
  BehaviorSubject,
  Observable,
  Subject,
  concat,
  debounceTime,
  distinctUntilChanged,
  filter,
  of,
  startWith,
  switchMap,
} from 'rxjs';
import { indicate } from 'src/app/helpers';
import { CitySearchResults } from 'src/app/httpClients/teleport';

@Component({
  selector: 'app-cities-search',
  templateUrl: './cities-search.component.html',
  styleUrls: ['./cities-search.component.sass'],
})
export class CitiesSearchComponent {
  protected search$ = new BehaviorSubject('');
  protected loading$ = new BehaviorSubject(false);
  constructor(private cityService: CitiesService) {}
  obs$ = this.search$.pipe(
    debounceTime(200),
    filter((x) => x.length > 3),
    distinctUntilChanged(),
    switchMap((query) =>
      this.cityService.searchCities(query, 10).pipe(indicate(this.loading$))
    )
  );
}
