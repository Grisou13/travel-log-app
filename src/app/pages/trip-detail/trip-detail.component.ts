import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, switchMap } from 'rxjs';
import { TravelLogService } from 'src/app/httpClients/travelLogApi/travel-log.service';
import { Trip } from 'src/app/httpClients/travelLogApi/trips/schema';

@Component({
  selector: 'app-trip-detail',
  templateUrl: './trip-detail.component.html',
  styleUrls: ['./trip-detail.component.sass'],
})
export class TripDetailComponent {
  selectedId: string = '';
  trip$: Observable<Trip>;
  constructor(
    private route: ActivatedRoute,
    private travelService: TravelLogService
  ) {
    this.trip$ = this.route.paramMap.pipe(
      switchMap((params) => {
        this.selectedId = params.get('id') || '';
        return this.travelService.trips.fetchById(this.selectedId);
      })
    );
  }
}
