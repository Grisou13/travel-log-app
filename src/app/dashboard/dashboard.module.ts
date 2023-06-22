import { ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { TravelLogApiModule } from '../httpClients/travelLogApi/travelLogApi.module';
import { routes } from './dashboard-routing.module';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';
import { NavbarComponent } from './components/navbar/navbar.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { TripDetailComponent } from './pages/trip-detail/trip-detail.component';
import TripListComponent from './pages/trip-list/trip-list.component';
import { NewTripComponent } from './components/new-trip/new-trip.component';
import { TripPlannerComponent } from './components/trip-planner/trip-planner.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { TripService } from './services/trip.service';
import { AddPlaceComponent } from './components/add-place/add-place.component';
import { TripCardComponent } from './pages/trip-list/trip-card/trip-card.component';

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
  ],
  imports: [SharedModule, RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardModule {
  static forRoot(): ModuleWithProviders<DashboardModule> {
    return {
      ngModule: DashboardModule,

      providers: [
        TripService,
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
