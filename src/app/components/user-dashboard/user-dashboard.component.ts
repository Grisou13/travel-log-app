import { Component } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth-service.service';

@Component({
  selector: 'app-user-dashboard',
  templateUrl: './user-dashboard.component.html',
  styleUrls: ['./user-dashboard.component.sass'],
})
export class UserDashboardComponent {
  user$: typeof this.authService.user$;
  constructor(private authService: AuthService) {
    this.user$ = this.authService.user$;
  }
}
