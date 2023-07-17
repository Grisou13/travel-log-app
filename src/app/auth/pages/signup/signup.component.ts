import { initTE, Input } from 'tw-elements';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/auth/services/auth-service.service';
import { BehaviorSubject, Subscription } from 'rxjs';
import { indicate } from 'src/app/helpers';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.sass'],
})
export class SignupComponent implements OnInit {
  protected loading$ = new BehaviorSubject(false);
  returnUrl: string = '/app';

  signupForm = this.fb.group({
    username: '', //['', Validators.required],
    password: '', //['', Validators.required],
  });

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

  signup(): void {
    if (!this.signupForm.valid) {
      return;
    }
    const username = this.signupForm.get('username')?.value || '';
    const password = this.signupForm.get('password')?.value || '';
    this.loginService
      .signup({
        name: username,
        password,
      })
      .pipe(indicate(this.loading$), takeUntilDestroyed())
      .subscribe({
        next: (user) => {
          this.signupForm.reset();

          console.log('Logged in as user:', user);
          this.router.navigate([this.returnUrl]);
        },
        error: (err) => {
          console.log(err);
        },
      });
  }
}
