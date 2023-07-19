
import { Component, EventEmitter, Output } from '@angular/core';
import { Point } from 'geojson';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { BehaviorSubject } from 'rxjs';
import { Result } from '@shared/components/cities-search/cities-search.component';
import { Trip } from './../../models/trips';
import * as L from 'leaflet';
import { iconDefault } from '@shared/components/map/map.component';
import { Stepper, initTE } from "tw-elements";

@Component({
  selector: 'app-add-trip',
  templateUrl: './add-trip.component.html',
  styleUrls: ['./add-trip.component.sass']
})

export class AddTripComponent {

  selectedStart: Result | null = null;
  constructor(private travelLogService: TravelLogService) {}

  private markersState = new BehaviorSubject<L.Marker | null>(null);
  
  @Output() tripCreated = new EventEmitter<Trip>();

  ngOnInit(): void {}

  ngAfterViewInit() {
    initTE({ Stepper });
  }

  mapSelected($event: Point) {
    this.markersState.next(
      L.marker([$event.coordinates[1], $event.coordinates[0]], {
        icon: iconDefault,
        title: `You selected here!`,
      })
    );
  }
  @Output() locationSelected = new EventEmitter<Result>();

  placeSelected($event: Result) {
    this.locationSelected.emit($event);
  }
}
