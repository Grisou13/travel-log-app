import { Component, Input, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, filter, last, map, of, startWith, switchMap } from 'rxjs';
import { Trip } from 'src/app/dashboard/models/trips';
import { PlaceService } from 'src/app/dashboard/services/place.service';
import { AsObservable, Observe } from 'src/app/helpers';

@Component({
  selector: 'app-trip-card',
  templateUrl: './trip-card.component.html',
  styleUrls: ['./trip-card.component.sass'],
})
export class TripCardComponent {
  @Input({ required: true, alias: 'trip' })
  public trip!: Trip;

  @Observe('trip')
  public trip$!: Observable<Trip>;

  places$ = this.trip$.pipe(
    switchMap((trip) => {
      if (trip === null) return of([]);
      return this.placeService.fetchForTrip(trip);
    })
  );
  tripStops$ = this.places$.pipe(
    map((places) => places.filter((x) => x.type === 'TripStop'))
  );
  tripEnd$ = this.tripStops$.pipe(
    startWith(null),
    map((places) => {
      if (places === null) return null;
      return places.pop();
    })
  );
  tripStart$ = this.tripStops$.pipe(
    startWith(null),
    map((places) => {
      if (places === null) return null;
      return places.shift();
    })
  );

  navigateToNewTrip($event: Trip) {
    const id = $event.id || null;
    this.router.navigate(['/dashboard/trips/', id]);
  }

  constructor(private placeService: PlaceService, private router: Router) {}
}
