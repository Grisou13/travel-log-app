import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth-guard.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import TripListComponent from './pages/trip-list/trip-list.component';
import { TripDetailComponent } from './pages/trip-detail/trip-detail.component';
import { PlaceDetailComponent } from './pages/place-detail/place-detail.component';

export const routes: Routes = [
  {
    path: '',
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
      {
        path: 'places/:id',
        component: PlaceDetailComponent,
      },
    ],
  },
];
