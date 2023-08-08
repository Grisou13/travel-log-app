import { CdkDragDrop, moveItemInArray } from '@angular/cdk/drag-drop';
import { Component, Input } from '@angular/core';
import { Place } from '../../models/places';
import { BehaviorSubject, distinctUntilChanged, shareReplay } from 'rxjs';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.sass'],
})
export class PlaceListComponent {
  state = new BehaviorSubject<Place[]>([]);

  places$ = this.state
    .asObservable()
    .pipe(distinctUntilChanged(), shareReplay(1));

  drop($event: CdkDragDrop<Place, any, any>) {
    console.log($event);
    const currentState = this.state.getValue();
    //swap elements
    moveItemInArray(currentState, $event.previousIndex, $event.currentIndex);
    this.state.next(currentState);
  }
  @Input({ required: true }) set places(val: Place[]) {
    this.state.next(val);
  }
}
