import { initTE, Modal, Ripple } from 'tw-elements';
import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { City } from 'src/app/httpClients/teleport';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { concatMap, forkJoin, mergeMap, of, switchMap } from 'rxjs';
import { CitySearchResult } from '../../../shared/components/cities-search/cities-search.component';
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
  public onCitySelect($event: CitySearchResult) {
    this.travelLogService.trips
      .create({
        title: $event.full_name,
        description: "{'description':'Trip to " + $event.full_name + "'}",
      })
      .pipe(
        mergeMap((trip) => {
          return forkJoin([
            of(trip),
            this.travelLogService.places.create({
              tripId: trip.id,
              name: $event.full_name,
              description: '{}',
              location: {
                type: 'Point',
                coordinates: [
                  $event.location.latlon.longitude,
                  $event.location.latlon.latitude,
                ],
              },
            }),
            this.travelLogService.trips.update({
              ...trip,
              pictureUrl: $event.pictures?.at(0)?.image.web ?? '',
            }),
          ]);
        })
      )
      .subscribe(([originalTrip, place, trip]) => {
        console.log(trip);
        this.tripCreated.emit(trip);
      });
  }
}
