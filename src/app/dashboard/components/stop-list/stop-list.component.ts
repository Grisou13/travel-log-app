import { Component, Input } from '@angular/core';
import { Place } from '../../models/places';

@Component({
  selector: 'app-stop-list',
  templateUrl: './stop-list.component.html',
  styleUrls: ['./stop-list.component.sass'],
})
export class StopListComponent {
  @Input({ required: true }) places: Place[] = [];
}
