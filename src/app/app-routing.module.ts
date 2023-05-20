import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard.guard';
import { AppComponent } from './app.component';
import { anonGuard } from './auth/guards/anon-guard.guard';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IndexComponent } from './pages/index/index.component';
import { HomeComponent } from './pages/home/home.component';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [anonGuard],
    pathMatch: 'full',
    component: IndexComponent,
  },

  {
    path: 'app',
    canActivate: [authGuard],
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: HomeComponent,
      },
    ],
  },
  {
    path: '',
    component: AuthLayoutComponent,
    children: [
      {
        path: 'login',
        // canActivate: [anonGuard],
        component: LoginComponent,
        title: 'Login',
        data: {
          title: 'Login',
        },
      },
      {
        path: 'register',
        canActivate: [anonGuard],
        component: SignupComponent,
        title: 'Register',
        data: {
          title: 'Register',
        },
      },
    ],
  },
  {
    path: 'signup',
    pathMatch: 'full',
    redirectTo: '/register',
  },
  {
    path: 'dashboard',
    redirectTo: '/app',
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
