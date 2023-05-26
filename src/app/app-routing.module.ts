import { NgModule, inject } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard.guard';
import { anonGuard } from './auth/guards/anon-guard.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IndexComponent } from './pages/index/index.component';
import { HomeComponent } from './pages/home/home.component';
import { TripListComponent } from './pages/trip-list/trip-list.component';
import { TripDetailComponent } from './pages/trip-detail/trip-detail.component';

const routes: Routes = [
  {
    path: '',
    canActivate: [anonGuard],
    pathMatch: 'full',
    component: IndexComponent,
  },
  {
    path: 'dashboard',
    canActivate: [authGuard],
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        component: TripListComponent,
      },
      {
        path: 'trips/:id',
        component: TripDetailComponent,
      },
    ],
  },
  {
    path: 'register',
    pathMatch: 'full',
    redirectTo: '/auth/register',
  },
  {
    path: 'login',
    pathMatch: 'full',
    redirectTo: '/auth/login',
  },
  {
    path: 'app',
    redirectTo: '/dashboard',
  },
  {
    path: 'auth',
    loadChildren: () => import('./auth/auth.module').then((m) => m.AuthModule),
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
