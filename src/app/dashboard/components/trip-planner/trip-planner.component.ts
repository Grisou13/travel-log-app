import { Trip } from '@httpClients/travelLogApi/trips/schema';
import { Component, Input } from '@angular/core';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { indicate } from 'src/app/helpers';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';

@Component({
  selector: 'app-trip-planner',
  templateUrl: './trip-planner.component.html',
  styleUrls: ['./trip-planner.component.sass'],
})
export class TripPlannerComponent {
  loading$ = new BehaviorSubject(false);
  @Input() trip: Trip | null = null;
  trip$ = of(this.trip).pipe(
    switchMap((x) => {
      if (!x) {
        return of(null);
      }
      return this.travelLogService.trips
        .fetchOne(x)
        .pipe(indicate(this.loading$));
    })
  );
  constructor(
    private authService: AuthService,
    private travelLogService: TravelLogService
  ) {}
}
