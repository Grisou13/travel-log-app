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
import { animate, style, transition, trigger } from '@angular/animations';

@Component({
  selector: 'app-trip-list',
  templateUrl: './trip-list.component.html',
  styleUrls: [],
  animations: [
    trigger('fadeInOut', [
      transition('void => *', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
      transition('* => void', [animate('300ms', style({ opacity: 0 }))]),
    ]),
  ],
})
export default class TripListComponent {
  loading$ = new BehaviorSubject(false);

  trips$ = this.tripService.items$;

  constructor(
    private router: Router,
    private tripService: TripService,
    private toastr: ToastrService
  ) {}

  navigateToNewTrip($event: Trip) {
    this.toastr.success(
      `Your trip to ${$event.title} has been succesfully created`
    );

    const id = $event.id || null;
    this.router.navigate(['/dashboard/trips/', id]);
  }
}
