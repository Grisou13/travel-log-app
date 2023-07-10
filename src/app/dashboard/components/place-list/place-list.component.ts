import { Component, Input } from '@angular/core';
import { Place } from '../../models/places';

@Component({
  selector: 'app-place-list',
  templateUrl: './place-list.component.html',
  styleUrls: ['./place-list.component.sass'],
})
export class PlaceListComponent {
  @Input({ required: true }) places: Place[] = [];
}
