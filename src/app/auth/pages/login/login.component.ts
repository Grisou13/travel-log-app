import { initTE, Input } from 'tw-elements';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { BehaviorSubject, delay, Subscription, takeLast, tap } from 'rxjs';
import { indicate } from 'src/app/helpers';

@Component({
  templateUrl: './login.component.html',
  styleUrls: [],
})
export class LoginComponent implements OnInit, OnDestroy {
  returnUrl: string = '/app';
  loading$ = new BehaviorSubject(false);
  loginForm = this.fb.group({
    username: '',
    password: '',
  });
  sub$: Subscription | null = null;

  constructor(
    private loginService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}
  ngOnInit() {
    initTE({ Input });
    this.returnUrl =
      this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }

  login() {
    if (!this.loginForm.valid) {
      return;
    }
    const username = this.loginForm.get('username')?.value || '';
    const password = this.loginForm.get('password')?.value || '';

    this.sub$ = this.loginService
      .authenticate({
        authMethod: 'default',
        credential: username,
        password,
      })
      .pipe(delay(100), indicate(this.loading$), takeLast(1))
      .subscribe({
        next: (user) => {
          console.debug('Logged in as user:', user);
          const { returnUrl, ...params } = this.route.snapshot.queryParams;
          this.router.navigate([this.returnUrl], { queryParams: params });
        },
        error: console.error,
        complete: () => {},
      });
  }
  ngOnDestroy() {
    this.sub$?.unsubscribe();
  }
}
