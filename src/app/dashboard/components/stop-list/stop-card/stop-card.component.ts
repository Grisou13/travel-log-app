import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Place } from 'src/app/dashboard/models/places';

@Component({
  selector: 'app-stop-card',
  templateUrl: './stop-card.component.html',
  styleUrls: ['./stop-card.component.sass'],
})
export class StopCardComponent {
  @Input({ required: true }) place!: Place;
  constructor(private router: Router) {}
  navigateTo(place: Place) {
    this.router.navigate(['places/', place.id]);
  }
}
