import { AuthService } from 'src/app/auth/services/auth-service.service';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { Router } from '@angular/router';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: [],
})
export class DashboardComponent implements OnInit, OnDestroy {
  sub: Subscription | null = null;
  constructor(private authService: AuthService, private router: Router) {}
  ngOnInit(): void {
    this.sub = this.authService.IsAuthenticated$.subscribe((isConnected) => {
      if (isConnected) return;

      this.router.navigate(['/']);
    });
  }
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
}
