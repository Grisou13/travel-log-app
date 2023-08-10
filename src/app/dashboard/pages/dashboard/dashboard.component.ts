import { AuthService } from 'src/app/auth/services/auth-service.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  templateUrl: './dashboard.component.html',
  styleUrls: [],
})
export class DashboardComponent {
  _ = this.authService.IsAuthenticated$.pipe(takeUntilDestroyed()).subscribe(
    (isConnected) => {
      if (isConnected) return;

      this.router.navigate(['/']);
    }
  );
  constructor(private authService: AuthService, private router: Router) {}
}
