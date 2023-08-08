import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { SharedModule } from '@shared/shared.module';
import { Observable, Subscription, tap } from 'rxjs';

@Component({
  selector: 'app-auth-layout',
  templateUrl: './auth-layout.component.html',
  styleUrls: [],
  standalone: true,
  imports: [SharedModule, CommonModule, RouterModule],
})
export class AuthLayoutComponent implements OnInit, OnDestroy {
  title: string | undefined = ''; //Observable<string | undefined>;
  constructor(private route: ActivatedRoute) {
    // this.title = this.route.title;
    // this.title.pipe(
    //   tap((x) => {
    //     console.debug(x);
    //   })
    // );
  }

  ngOnInit() {
    this.title = this.route.firstChild?.snapshot.title || '';
    // this.sub = this.route.title.subscribe((v) => console.debug(v));
  }
  ngOnDestroy() {
    // this.sub?.unsubscribe();
  }
}
