import { AuthService } from 'src/app/auth/services/auth-service.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.sass'],
})
export class DashboardComponent implements OnInit {
  sub: Subscription | null = null;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.authService.IsAuthenticated$.pipe(takeUntilDestroyed()).subscribe((isConnected) => {
      if (isConnected) return;

      this.router.navigate(['/']);
    });
  }
}
