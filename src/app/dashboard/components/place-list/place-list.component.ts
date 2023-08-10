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

  updateState = new BehaviorSubject<[Place | null, Place, Place] | null>(null);
  places$ = this.state
    .asObservable()
    .pipe(distinctUntilChanged(), shareReplay(1));

  _ = this.updateState
    .asObservable()
    .pipe(
      switchMap((data) => {
        if (data === null) return EMPTY;
        //place 1 is the start, can be null
        //place2 is from
        //place3 is to

        const [place1, place2, place3] = data;
        //place3 becomes place2
        //and place2 becomes place3
        // place3prime.previous = place3.previous
        let place2Prime = Object.assign({}, place3); //temp becoms the new "to"
        let place3Prime = Object.assign({}, place2);

        if (typeof place2Prime.directions === 'undefined') {
          place2Prime.directions = {};
        }
        if (typeof place3Prime.directions === 'undefined') {
          place3Prime.directions = {};
        }
        // place3Prime.order = place2.order;
        place3Prime.order = place3.order;
        //TODO we can only do this if we change only a single position at a time, but if the user decides to skip multiple then we are out of luck?
        place3Prime.directions.previous = place3.directions?.previous;

        place2Prime.order = place2.order;
        // return of(null);
        return forkJoin([
          this.placeService.update(place3Prime.id, place3Prime),
          of(place1).pipe(
            switchMap((previousStop) => {
              if (previousStop === null) {
                return of(place2Prime);
              }

              const request = DirectionRequest.parse({
                coordinates: [
                  previousStop.location.coordinates,
                  place2Prime.location.coordinates,
                ],
                extra_info: ['tollways', 'roadaccessrestrictions'],
              });
              return this.directionsService
                .fetchDirectionsGeoJson(request)
                .pipe(
                  map((d) => {
                    if (typeof place2Prime.directions === 'undefined') {
                      place2Prime.directions = {};
                    }
                    place2Prime.directions.previous = d;
                    return place2Prime;
                  })
                );
            }),
            switchMap((x) => this.placeService.update(x.id, x))
          ),
        ]);
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
    const payload: [Place | null, Place, Place] = [
      currentState[$event.previousIndex - 1] || null,
      currentState[$event.previousIndex],
      currentState[$event.currentIndex],
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
