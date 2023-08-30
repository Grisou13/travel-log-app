import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTripForm } from '../../components/new-trip/new-trip.component';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import { Subscription, mergeMap, of, forkJoin, switchMap } from 'rxjs';
import { formToPlace, formToTrip } from '../../helpers';

@Component({
  templateUrl: './trip-add.component.html',
  styleUrls: [],
})
export class TripAddComponent implements OnDestroy {
  // show = false;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private travelLogService: TravelLogService
  ) {}
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }

  navigateBack() {
    setTimeout(
      () => this.router.navigate(['../'], { relativeTo: this.route }),
      350
    );
  }
  sub: Subscription | null = null;
  createTrip(form: NewTripForm) {
    this.sub = this.travelLogService.trips
      .create(formToTrip({ form }))
      .pipe(
        mergeMap((trip) => {
          const start = formToPlace({
            tripId: trip.id,
            places: [],
            form: form?.start || {},
            geoJson: undefined,
          });

          let stop = formToPlace({
            tripId: trip.id,
            places: [],
            form: form?.end || {},
            geoJson: undefined,
          });
          if (!form.defineStop) {
            stop = null;
          }
          return forkJoin([
            of(trip),
            of(start).pipe(
              switchMap((x) =>
                x === null
                  ? of(null)
                  : this.travelLogService.places.create({ ...x, order: 1 })
              )
            ),
            of(stop).pipe(
              switchMap((x) =>
                x === null
                  ? of(null)
                  : this.travelLogService.places.create({ ...x, order: 2 })
              )
            ),
          ]);
        })
      )
      .subscribe(([trip, place]) => {
        console.debug(trip);
        this.router.navigate(['../' + trip.id], { relativeTo: this.route });
      });
  }
}
