import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Place } from '../../models/places';
import {
  BehaviorSubject,
  EMPTY,
  Subscription,
  concatMap,
  distinctUntilChanged,
  filter,
  forkJoin,
  map,
  of,
  shareReplay,
  switchMap,
} from 'rxjs';
import { PlaceService } from '../../services/place.service';
import * as _ from 'lodash';
import { DirectionRequest } from '@httpClients/open-route-service/directions/schema';
import { DirectionsService } from '@httpClients/open-route-service/directions/directions.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.sass'],
})
export class PlaceListComponent {
  sub$: Subscription | null = null;
  state = new BehaviorSubject<Place[]>([]);

  updateState = new BehaviorSubject<[Place, Place, Place | undefined] | null>(
    null
  );
  places$ = this.state
    .asObservable()
    .pipe(distinctUntilChanged(), shareReplay(1));

  _ = this.updateState
    .asObservable()
    .pipe(
      switchMap((data) => {
        if (data === null) return EMPTY;

        const [place1, place2, maybe] = data;

        const tmpOrder = place1.order;
        const tmpDate = place1.startDate;
        if (typeof place1.directions === 'undefined') {
          place1.directions = {
            distance: 0,
            previous: null,
            next: null,
          };
        }
        place1.directions.previous = null;

        if (typeof place2.directions === 'undefined') {
          place2.directions = {
            distance: 0,
            previous: null,
            next: null,
          };
        }
        place2.directions.previous = null;
        if (typeof maybe !== 'undefined') {
          if (typeof maybe.directions === 'undefined') {
            maybe.directions = {
              distance: 0,
              previous: null,
              next: null,
            };
          }
          maybe.directions.previous = null;
        }

        place1.order = place2.order;
        place1.startDate = place2.startDate;
        place2.order = tmpOrder;
        place2.startDate = tmpDate;
        let payload = [place1, place2];
        if (typeof maybe !== 'undefined') payload = [maybe].concat(payload);
        // return of(null);
        return forkJoin(
          payload
            .filter((x) => typeof x !== 'undefined')
            .map((x) => this.placeService.update(x.id, x))
        );
      }),
      takeUntilDestroyed()
    )
    .subscribe();
  constructor(
    private placeService: PlaceService,
    private directionsService: DirectionsService
  ) {}

  drop($event: CdkDragDrop<Place, any, any>) {
    if ($event.previousIndex === $event.currentIndex) return;
    console.log($event);
    const currentState = _.orderBy(this.state.getValue(), 'order');
    const payload: [Place, Place, Place | undefined] = [
      currentState[$event.previousIndex],
      currentState[$event.currentIndex],
      currentState[$event.currentIndex + 1] || undefined,
    ];
    moveItemInArray(currentState, $event.previousIndex, $event.currentIndex);
    this.updateState.next(payload);
    //swap elements
    this.state.next(currentState);
  }
  @Input({ required: true }) set places(val: Place[]) {
    this.state.next(val);
  }
}
