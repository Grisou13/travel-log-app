import { Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth-guard.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import TripListComponent from './pages/trip-list/trip-list.component';
import { TripDetailComponent } from './pages/trip-detail/trip-detail.component';
import { PlaceDetailComponent } from './pages/place-detail/place-detail.component';
import { PlaceComponent } from './pages/trip-detail/place/place.component';

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
        path: 'trips/:tripId',
        component: TripDetailComponent,
        children: [
          {
            path: 'places/:placeId',
            component: PlaceComponent,
          },
        ],
      },
      {
        path: 'places/:placeId',
        component: PlaceDetailComponent,
      },
    ],
  },
];
