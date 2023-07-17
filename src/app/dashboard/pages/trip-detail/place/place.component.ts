import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.sass']
})
export class PlaceComponent {
  constructor(private router: Router){}
  navigateToTrip(){
    // this.router.navigate(["./"])
  }
}
