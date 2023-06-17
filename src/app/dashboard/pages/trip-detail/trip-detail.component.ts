import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Place } from '@httpClients/travelLogApi/places/schema';
import { Observable, concatMap, forkJoin, of, switchMap } from 'rxjs';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { TripService } from '../../services/trip.service';
import { Trip } from '../../models/trips';
import * as L from 'leaflet';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.sass'],
})
export class TripDetailComponent {
  selectedId: string = '';
  trip$: Observable<Trip | null> = this.route.paramMap.pipe(
    switchMap((params) => {
      const id = params.get('id') || null;
      if (id === null) return of(null);
      this.selectedId = id;
      return this.tripService.get(id);
    })
  );
  constructor(
    private route: ActivatedRoute,
    private tripService: TripService
  ) {}

  getPlacesAsMarkers(trip: Trip) {
    return trip.places.map((x) =>
      L.marker([x.location.coordinates[0], x.location.coordinates[0]])
    );
  }
}
