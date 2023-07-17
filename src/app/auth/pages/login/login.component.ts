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
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit {
  returnUrl: string = '/app';
  loading$ = new BehaviorSubject(false);
  loginForm = this.fb.group({
    username: '',
    password: '',
  });

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

    this.loginService
      .authenticate({
        authMethod: 'default',
        credential: username,
        password,
      })
      .pipe(delay(100), indicate(this.loading$), takeLast(1), takeUntilDestroyed())
      .subscribe({
        next: (user) => {
          console.log('Logged in as user:', user);
          this.router.navigate([this.returnUrl]);
        },
        error: console.error,
        complete: () => {},
      });
  }
}
