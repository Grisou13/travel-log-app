import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Result } from '@shared/components/cities-search/cities-search.component';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { SharedModule } from '@shared/shared.module';

@Component({
  templateUrl: './index.component.html',
  styleUrls: [],
  standalone: true,
  imports: [SharedModule],
})
export class IndexComponent {
  constructor(private router: Router) {}
  navigateToLogin($event: Result) {
    this.router.navigate(['/login'], {
      queryParams: {
        returnUrl: '/dashboard/trips/new',
        initialData: JSON.stringify($event),
      },
    });
  }
}
