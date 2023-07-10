import { Component, Input } from '@angular/core';
import { Place } from 'src/app/dashboard/models/places';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html',
  styleUrls: ['./place-card.component.sass'],
})
export class PlaceCardComponent {
  @Input({ required: true }) place!: Place;
  navigateTo(place: Place) {}
}
