import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { indicate } from 'src/app/helpers';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trips';
import { Place } from '../../models/places';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.sass'],
})
export default class TripListComponent implements AfterViewInit {
  getTripEnd(trip: Trip): Place {
    const place = trip.places.filter((x) => x.type === 'TripStop').pop();
    if (place === undefined) {
      throw new Error('Could not find start of trip');
    }
    return place;
  }
  hasTripEnd(trip: Trip): boolean {
    return trip.places.filter((x) => x.type === 'TripStop').length > 1;
  }
  getStartOfTrip(trip: Trip): Place {
    const place = trip.places.filter((x) => x.type === 'TripStop').shift();
    if (place === undefined) {
      throw new Error('Could not find start of trip');
    }
    return place;
  }
  loading$ = new BehaviorSubject(false);

  trips$ = this.tripService.items$;

  constructor(
    private tripService: TripService,
    private router: Router,
    private route: ActivatedRoute
  ) {}
  ngAfterViewInit(): void {}

  ngOnInit() {
    // this.trips$ = this.trips$.pipe(indicate(this.loading$));
  }

  navigateToNewTrip($event: Trip) {
    const id = $event.id || null;
    this.router.navigate(['/dashboard/trips/', id]);
  }
}
