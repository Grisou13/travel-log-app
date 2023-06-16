import { initTE, Modal, Ripple } from 'tw-elements';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { City } from 'src/app/httpClients/teleport';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { concatMap, forkJoin, mergeMap, of, switchMap } from 'rxjs';
import {
  CitySearchResult,
  Result,
} from '../../../shared/components/cities-search/cities-search.component';
import { Trip } from 'src/app/httpClients/travelLogApi/trips/schema';

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.sass'],
})
export class NewTripComponent implements OnInit {
  constructor(private travelLogService: TravelLogService) {}
  @Output() tripCreated = new EventEmitter<Trip>();
  ngOnInit(): void {
    initTE({ Modal, Ripple });
  }
  public onCitySelect($event: Result) {
    this.travelLogService.trips
      .create({
        title: $event.name,
        description: 'Trip to ' + $event.name,
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
              name: $event.name,
              pictureUrl: $event.pictureUrl || undefined,
              description: 'First stop',
              location: $event.location,
            }),
          ]);
        })
      )
      .subscribe(([trip, place]) => {
        console.log(trip);
        this.tripCreated.emit(trip);
      });
  }
}
