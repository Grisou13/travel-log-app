import { Location } from '@angular/common';
import { AfterViewInit, Component } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { tap } from 'rxjs';

@Component({
  selector: 'app-place',
  templateUrl: './place.component.html',
  styleUrls: ['./place.component.sass']
})
export class PlaceComponent implements AfterViewInit{
  // show = false;
  constructor(private router: Router, private location: Location, private route: ActivatedRoute){
    // this.router.events.pipe(tap({
    //   next: event => {
    //     if(event instanceof NavigationStart){
    //       console.log(event)
    //       console.log("Changing url")
    //       this.show = true;
    //     }
    //   }
    // }), takeUntilDestroyed()).subscribe()
  }
  ngAfterViewInit(): void {
  }
  
  navigateToTrip(){
    setTimeout(() => this.router.navigate(["../../"], {relativeTo: this.route}), 350)
  }
}
