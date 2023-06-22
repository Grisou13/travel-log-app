import { initTE, Modal, Ripple } from 'tw-elements';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { City } from 'src/app/httpClients/teleport';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { concatMap, forkJoin, mergeMap, of, switchMap } from 'rxjs';
import {
  CitySearchResult,
  Result,
} from '@shared/components/cities-search/cities-search.component';
import { Trip } from './../../models/trips';
import { PlaceService } from '../../services/place.service';
import { Place } from '../../models/places';

@Component({
  selector: 'app-add-place',
  templateUrl: './add-place.component.html',
  styleUrls: ['./add-place.component.sass'],
})
export class AddPlaceComponent {
  selectedLocation: Result | null = null;
  constructor(private placeService: PlaceService) {}
  @Input() trip: Trip | null = null;

  @Output() placeCreated = new EventEmitter<Place>();
  ngOnInit(): void {
    initTE({ Modal, Ripple });
  }
  public createPlace() {
    if (this.trip == null) return;
    if (!this.selectedLocation) return;
    const trip = this.trip;
    const selectedLocation = this.selectedLocation;

    this.placeService
      .add({
        startDate: new Date(),
        location: selectedLocation.location,
        type: 'TripStop',
        description: 'Stop at ' + selectedLocation.name,
        tripId: trip.id,
        name: selectedLocation.name,
        order: -1, //trip.places.length - 1,
        directions: {
          distance: 0,
          previous: {},
          next: {},
        },
      })

      .subscribe((place) => {
        if (typeof place === 'boolean') return;
        console.log(place);
        this.placeCreated.emit(place);
      });
  }
  public onCitySelect($event: Result) {
    this.selectedLocation = $event;
  }
}
