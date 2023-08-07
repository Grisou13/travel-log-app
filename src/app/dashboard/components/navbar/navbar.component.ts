import { Collapse, Dropdown, initTE } from 'tw-elements';
import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { distinctUntilChanged, shareReplay } from 'rxjs';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.sass'],
})
export class NavbarComponent implements OnInit {
  constructor(private authService: AuthService) {}

  isAuthenticated$ = this.authService.IsAuthenticated$.pipe(
    distinctUntilChanged(),
    shareReplay(1)
  );

  ngOnInit(): void {
    initTE({ Collapse, Dropdown });
  }

  logout() {
    this.authService.logout();
  }
}
