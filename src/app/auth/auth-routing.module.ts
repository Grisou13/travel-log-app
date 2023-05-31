import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { anonGuard } from './guards/anon-guard.guard';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';

import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';

export const routes: Routes = [
  {
    path: '',
    component: AuthLayoutComponent,
    canActivateChild: [anonGuard],
    children: [
      {
        path: 'login',
        //canActivate: [anonGuard],
        component: LoginComponent,
        title: 'Login',
        data: {
          title: 'Login',
        },
      },
      {
        path: 'register',
        // canActivate: [anonGuard],
        component: SignupComponent,
        title: 'Register',
        data: {
          title: 'Register',
        },
      },
    ],
  },
];
