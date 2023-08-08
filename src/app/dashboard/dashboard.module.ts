import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { DragDropModule } from '@angular/cdk/drag-drop';

import { TravelLogApiModule } from '../httpClients/travelLogApi/travelLogApi.module';
import { routes } from './dashboard-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import TripListComponent from './pages/trip-list/trip-list.component';
import { NewTripComponent } from './components/new-trip/new-trip.component';
import { TripPlannerComponent } from './components/trip-planner/trip-planner.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { TripService } from './services/trip.service';
import { AddPlaceComponent } from './components/add-place/add-place.component';
import { TripCardComponent } from './pages/trip-list/trip-card/trip-card.component';
import { PlaceService } from './services/place.service';
import { TripMapComponent } from './components/trip-map/trip-map.component';
import { PlaceListComponent } from './components/place-list/place-list.component';
import { PlaceDetailComponent } from './pages/place-detail/place-detail.component';
import { StopListComponent } from './components/stop-list/stop-list.component';
import { StopCardComponent } from './components/stop-list/stop-card/stop-card.component';
import { PlaceCardComponent } from './components/place-list/place-card/place-card.component';
import { TripOverviewComponent } from './pages/trip-detail/trip-overview/trip-overview.component';
import { TripAddComponent } from './pages/trip-add/trip-add.component';
import { PlaceComponent } from './pages/trip-detail/place/place.component';
import { TripDetailMapComponent } from './pages/trip-detail/trip-detail-map/trip-detail-map.component';
import { TripDetailComponent } from './pages/trip-detail/trip-detail.component';
import { TripHomeComponent } from './pages/trip-detail/trip-home/trip-home.component';

@NgModule({
  declarations: [
    NavbarComponent,
    DashboardComponent,
    HomeComponent,
    TripDetailComponent,
    TripListComponent,
    NewTripComponent,
    TripPlannerComponent,
    UserDashboardComponent,
    AddPlaceComponent,
    TripCardComponent,
    TripMapComponent,
    PlaceListComponent,
    PlaceDetailComponent,
    StopListComponent,
    StopCardComponent,
    PlaceCardComponent,
    PlaceComponent,
    TripHomeComponent,
    TripOverviewComponent,
    TripAddComponent,
    TripDetailMapComponent,
  ],
  imports: [SharedModule, DragDropModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardModule {
  static forRoot(): ModuleWithProviders<DashboardModule> {
    return {
      ngModule: DashboardModule,

      providers: [
        TripService,
        PlaceService,
        /*{
          provide: APP_INITIALIZER,
          useFactory: initAuth,
          deps: [AuthService],
          multi: true,
        },*/
      ],
    };
  }
}
