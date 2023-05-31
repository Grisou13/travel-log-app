import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { indicate } from 'src/app/helpers';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { Trip } from 'src/app/httpClients/travelLogApi/trips/schema';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.sass'],
})
export class TripListComponent {
  loading$ = new BehaviorSubject(false);

  trips$ = this.authService.user$.pipe(
    switchMap((user) => {
      if (!user) return of([]);
      return this.travelLogService.trips
        .fetchByUser(user.id, {})
        .pipe(indicate(this.loading$));
    })
  );

  constructor(
    private authService: AuthService,
    private travelLogService: TravelLogService,
    private router: Router
  ) {}

  navigateToNewTrip($event: Trip) {
    this.router.navigate(['/dashboard/trips/', { id: $event.id }]);
  }
}
