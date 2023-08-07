import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-trip-add',
  templateUrl: './trip-add.component.html',
  styleUrls: [],
})
export class TripAddComponent {
  // show = false;
  constructor(private router: Router, private route: ActivatedRoute) {
    // this.router.events.pipe(tap({
    //   next: event => {
    //     if(event instanceof NavigationStart){
    //       console.debug(event)
    //       console.debug("Changing url")
    //       this.show = true;
    //     }
    //   }
    // }), takeUntilDestroyed()).subscribe()
  }
  ngAfterViewInit(): void {}

  navigateBack() {
    setTimeout(
      () => this.router.navigate(['../'], { relativeTo: this.route }),
      350
    );
  }
}
