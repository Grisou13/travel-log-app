import { initTE, Input } from 'tw-elements';
import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { TravelLogApiHttp } from 'src/app/httpClients/travelLogApi/travelLogApi.module';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.sass'],
})
export class LoginComponent implements OnInit, OnDestroy {
  returnUrl: string = '/app';

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
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
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
      .subscribe(
        (user) => {
          console.log('Logged in as user:', user);
          this.router.navigate([this.returnUrl]);
        },
        (err) => {
          console.log(err);
        }
      );
  }
  ngOnDestroy() {
    this.sub$?.unsubscribe();
  }
}
