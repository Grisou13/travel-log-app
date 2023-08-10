import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NewTripForm } from '../../components/new-trip/new-trip.component';
import { TravelLogService } from '@httpClients/travelLogApi/travel-log.service';
import { Subscription, mergeMap, of, forkJoin } from 'rxjs';

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
  ) {
    // this.router.events.pipe(tap({
    //   next: event => {
    //     if(event instanceof NavigationStart){
    //       console.debug(event)
    //       console.debug("Changing url")
    //       this.show = true;
    //     }
    //   }
    // }), takeUntilDestroyed()).subscribe()
  }
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
      .create({
        title: form?.start?.title + ' ' + new Date().toLocaleDateString(),
        description: 'Trip to ' + form?.start?.title,
        startDate: new Date(),
      })
      .pipe(
        mergeMap((trip) => {
          return forkJoin([
            of(trip),
            this.travelLogService.places.create({
              tripId: trip.id,
              order: 0,
              type: 'TripStop',
              startDate: new Date(),
              directions: {
                distance: 0,
                next: {},
                previous: {},
              },
              name: form?.start?.title || 'Place for trip' + trip.id,
              pictureUrl: form?.start?.pictureUrl || undefined,
              description: 'First stop',
              location: {
                type: 'Point',
                coordinates: [
                  form.start?.location?.lng || 0,
                  form.start?.location?.lat || 0,
                ],
              },
            }),
          ]);
        })
      )
      .subscribe(([trip, place]) => {
        console.debug(trip);
      });
  }
}
