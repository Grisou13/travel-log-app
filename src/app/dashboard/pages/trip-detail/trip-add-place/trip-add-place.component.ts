import { TripService } from './../../../services/trip.service';
import { Location } from '@angular/common';
import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { of, switchMap } from 'rxjs';

@Component({
  selector: 'app-trip-add-place',
  templateUrl: './trip-add-place.component.html',
  styleUrls: [],
})
export class TripAddPlaceComponent {
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}
  trip$ = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('tripId') || null;
      if (id === null) return of(null);

      return this.tripService.get(id);
    })
  );

  navigateToTrip() {
    setTimeout(
      () => this.router.navigate(['../'], { relativeTo: this.route }),
      350
    );
  }
}
