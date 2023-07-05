import { AfterViewInit, Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BehaviorSubject, of, switchMap } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { indicate } from 'src/app/helpers';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trips';
import { Place } from '../../models/places';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: ['./trip-list.component.sass'],
})
export default class TripListComponent {
  loading$ = new BehaviorSubject(false);

  trips$ = this.tripService.items$;

  constructor(private router: Router, private tripService: TripService, private toastr: ToastrService) {}

  navigateToNewTrip($event: Trip) {
    this.toastr.success(`Your trip to ${$event.title} has been succesfully created`);

    const id = $event.id || null;
    this.router.navigate(['/dashboard/trips/', id]);
  }
}
