import { initTE, Input } from 'tw-elements';
import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { indicate } from 'src/app/helpers';

@Component({
  templateUrl: './signup.component.html',
  styleUrls: [],
})
export class SignupComponent implements OnInit, OnDestroy {
  protected loading$ = new BehaviorSubject(false);
  returnUrl: string = '/app';

  signupForm = new FormGroup({
    username: new FormControl('', [
      Validators.minLength(3),
      Validators.required,
    ]),
    password: new FormControl('', [
      Validators.minLength(4),
      Validators.required,
    ]),
  });
  sub: Subscription | null = null;

  constructor(
    private loginService: AuthService,
    private router: Router,
    private route: ActivatedRoute,
    private fb: FormBuilder
  ) {}
  ngOnDestroy(): void {
    this.sub?.unsubscribe();
  }
  ngOnInit() {
    initTE({ Input });
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  signup(): void {
    if (!this.signupForm.valid) {
      return;
    }
    const username = this.signupForm.get('username')?.value || '';
    const password = this.signupForm.get('password')?.value || '';
    this.sub = this.loginService
      .signup({
        name: username,
        password,
      })
      .pipe(indicate(this.loading$))
      .subscribe(
        (user) => {
          this.signupForm.reset();

          console.debug('Logged in as user:', user);
          this.router.navigate([this.returnUrl]);
        },
        (err) => {
          console.debug(err);
        }
      );
  }
}
