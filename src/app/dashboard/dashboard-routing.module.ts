import { RouterOutlet, Routes } from '@angular/router';
import { authGuard } from '../auth/guards/auth-guard.guard';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import TripListComponent from './pages/trip-list/trip-list.component';
import { PlaceDetailComponent } from './pages/place-detail/place-detail.component';
import { PlaceComponent } from './pages/trip-detail/place/place.component';
import { EmptyRouterOutletComponent } from '@shared/components/empty-router-outlet/empty-router-outlet.component';
import { TripAddComponent } from './pages/trip-add/trip-add.component';
import { TripDetailMapComponent } from './pages/trip-detail/trip-detail-map/trip-detail-map.component';
import { TripOverviewComponent } from './pages/trip-detail/trip-overview/trip-overview.component';
import { TripDetailComponent } from './pages/trip-detail/trip-detail.component';
import { TripHomeComponent } from './pages/trip-detail/trip-home/trip-home.component';
import { TripAddPlaceComponent } from './pages/trip-detail/trip-add-place/trip-add-place.component';

export const routes: Routes = [
  {
    path: '',
    canActivate: [authGuard],
    component: DashboardComponent,
    children: [
      {
        path: '',
        pathMatch: 'full',
        redirectTo: 'trips',
      },
      {
        path: 'trips',
        component: EmptyRouterOutletComponent,
        children: [
          {
            path: '',
            component: TripListComponent,
            children: [
              {
                path: 'new',
                component: TripAddComponent,
              },
            ],
          },
          {
            path: ':tripId',
            component: TripDetailComponent,
            children: [
              {
                path: '',
                pathMatch: 'full',
                redirectTo: 'list',
              },
              {
                path: 'list',
                component: TripHomeComponent,
                children: [
                  {
                    path: 'places/:placeId',
                    component: PlaceComponent,
                  },
                  {
                    path: 'places/new',
                    component: TripAddPlaceComponent,
                  },
                ],
              },
              {
                path: 'map',
                component: TripDetailMapComponent,
                children: [
                  {
                    path: 'places/:placeId',
                    component: PlaceComponent,
                  },
                  {
                    path: 'places/new',
                    component: TripAddPlaceComponent,
                  },
                ],
              },
              {
                path: 'overview',
                component: TripOverviewComponent,
                children: [
                  {
                    path: 'places/:placeId',
                    component: PlaceComponent,
                  },
                  {
                    path: 'places/new',
                    component: TripAddPlaceComponent,
                  },
                ],
              },

              {
                path: 'places/new',
                component: TripAddPlaceComponent,
              },
              /*{
                matcher: (segments, group, route) => {
                  const placesPath = segments.findIndex(
                    (x) => x.path === 'places'
                  );
                  if (placesPath < 0) return null;

                  const placeId = segments[placesPath + 1] || undefined;
                  if (placeId === null || typeof placeId === 'undefined') {
                    return null;
                  }
                  return {
                    consumed: segments,
                    posParams: {
                      placeId,
                    },
                  };
                },
                // path: 'places/:placeId',
                component: PlaceComponent,
              },*/
            ],
          },
        ],
      },
      {
        path: 'places/:placeId',
        pathMatch: 'prefix',
        component: PlaceComponent,
      },
    ],
  },
];
