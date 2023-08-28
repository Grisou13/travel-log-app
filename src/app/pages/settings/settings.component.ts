import { Component } from '@angular/core';
import { Location } from '@angular/common';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth-service.service';

@Component({
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  _ = this.authService.IsAuthenticated$.pipe(takeUntilDestroyed()).subscribe(
    (isConnected) => {
      if (isConnected) return;

      this.router.navigate(['/']);
    }
  );
  constructor(
    private authService: AuthService,
    private router: Router,
    private location: Location
  ) {}
  navigateBack() {
    this.location.back();
  }
}
