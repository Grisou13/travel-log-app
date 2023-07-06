import { Component, Input } from '@angular/core';
import { Place } from 'src/app/dashboard/models/places';

@Component({
  selector: 'app-stop-card',
  templateUrl: './stop-card.component.html',
  styleUrls: ['./stop-card.component.sass'],
})
export class StopCardComponent {
  @Input({ required: true }) place!: Place;

  navigateTo(place: Place) {}
}
