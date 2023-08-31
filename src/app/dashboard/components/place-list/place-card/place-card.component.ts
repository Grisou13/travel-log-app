import { Component, Input } from '@angular/core';
import { dateToForm } from 'src/app/dashboard/helpers';
import { Place } from 'src/app/dashboard/models/places';

@Component({
  selector: 'app-place-card',
  templateUrl: './place-card.component.html',
  styleUrls: [],
})
export class PlaceCardComponent {
  @Input({ required: true }) place!: Place;
  navigateTo(place: Place) {}
  dateToForm(x: any) {
    return dateToForm(x);
  }
}
