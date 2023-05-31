import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: ['./auth-layout.component.sass'],
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  title: string | undefined = ''; //Observable<string | undefined>;
  constructor(private route: ActivatedRoute) {
    // this.title = this.route.title;
    // this.title.pipe(
    //   tap((x) => {
    //     console.log(x);
    //   })
    // );
  }

  ngOnInit() {
    this.title = this.route.firstChild?.snapshot.title || '';
    // this.sub = this.route.title.subscribe((v) => console.log(v));
  }
  ngOnDestroy() {
    // this.sub?.unsubscribe();
  }
}
