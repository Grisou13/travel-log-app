import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TravelLogApiModule } from './httpClients/travelLogApi/travelLogApi.module';
import { AuthModule } from './auth/auth.module';
import { LoginComponent } from './auth/pages/login/login.component';
import { TripPlannerComponent } from './components/trip-planner/trip-planner.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IndexComponent } from './pages/index/index.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutComponent } from './auth/components/auth-layout/auth-layout.component';
import { CitiesSearchComponent } from './components/cities-search/cities-search.component';
import { WithLoadingPipe } from './pipes/with-loading.pipe';
import { Configuration, TeleportApiModule } from './httpClients/teleport';
import { HttpClientModule } from '@angular/common/http';
import { TripListComponent } from './pages/trip-list/trip-list.component';
import { NewTripComponent } from './components/new-trip/new-trip.component';
import { TripDetailComponent } from './pages/trip-detail/trip-detail.component';

@NgModule({
  declarations: [
    AppComponent,
    TripPlannerComponent,
    DashboardComponent,
    IndexComponent,
    NavbarComponent,
    UserDashboardComponent,
    HomeComponent,
    CitiesSearchComponent,
    WithLoadingPipe,
    TripListComponent,
    NewTripComponent,
    TripDetailComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TravelLogApiModule,
    TeleportApiModule.forRoot(() => new Configuration({})),
    AuthModule.forRoot(),
  ],
  providers: [TravelLogApiModule, AuthModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
