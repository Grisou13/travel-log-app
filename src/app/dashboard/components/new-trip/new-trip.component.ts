import { initTE, Modal, Ripple } from 'tw-elements';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { City } from 'src/app/httpClients/teleport';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { concatMap, forkJoin, mergeMap, of, switchMap } from 'rxjs';
import {
  CitySearchResult,
  Result,
} from '@shared/components/cities-search/cities-search.component';
import { Trip } from './../../models/trips';

@Component({
  selector: 'app-new-trip',
  templateUrl: './new-trip.component.html',
  styleUrls: ['./new-trip.component.sass'],
})
export class NewTripComponent implements OnInit {
  selectedStart: Result | null = null;
  constructor(private travelLogService: TravelLogService) {}
  @Output() tripCreated = new EventEmitter<Trip>();
  ngOnInit(): void {
    initTE({ Modal, Ripple });
  }
  public createTrip() {
    if (!this.selectedStart) return;
    const startCity = this.selectedStart;
    this.travelLogService.trips
      .create({
        title: startCity.name + ' ' + new Date().toLocaleDateString(),
        description: 'Trip to ' + startCity.name,
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
              name: startCity.name,
              pictureUrl: startCity.pictureUrl || undefined,
              description: 'First stop',
              location: startCity.location,
            }),
          ]);
        })
      )
      .subscribe(([trip, place]) => {
        console.debug(trip);

        this.tripCreated.emit({ ...trip });
      });
  }
  public onCitySelect($event: Result) {
    this.selectedStart = $event;
  }
}
