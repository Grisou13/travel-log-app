import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { indicate } from 'src/app/helpers';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import type { Trip } from '@httpClients/travelLogApi/trips/schema';
import { TripService } from '../../services/trip.service';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.sass'],
})
export class TripListComponent {
  loading$ = new BehaviorSubject(false);

  trips$ = this.tripService.items$.pipe(indicate(this.loading$));

  constructor(private tripService: TripService, private router: Router) {}

  navigateToNewTrip($event: Trip) {
    this.router.navigate(['/dashboard/trips/', { id: $event.id }]);
  }
}
