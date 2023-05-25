import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TravelLogApiModule } from './httpClients/travelLogApi/travelLogApi.module';
import { AuthModule } from './auth/auth.module';
import { LoginComponent } from './pages/login/login.component';
import { SignupComponent } from './pages/signup/signup.component';
import { TripPlannerComponent } from './components/trip-planner/trip-planner.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { IndexComponent } from './pages/index/index.component';
import { NavbarComponent } from './components/navbar/navbar.component';
import { UserDashboardComponent } from './components/user-dashboard/user-dashboard.component';
import { HomeComponent } from './pages/home/home.component';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { CitiesSearchComponent } from './components/cities-search/cities-search.component';
import { WithLoadingPipe } from './pipes/with-loading.pipe';
import { Configuration, TeleportApiModule } from './httpClients/teleport';
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    AuthLayoutComponent,
    LoginComponent,
    SignupComponent,
    TripPlannerComponent,
    DashboardComponent,
    IndexComponent,
    NavbarComponent,
    UserDashboardComponent,
    HomeComponent,
    AuthLayoutComponent,
    CitiesSearchComponent,
    WithLoadingPipe,
  ],
  imports: [
    HttpClientModule,
    BrowserModule,
    ReactiveFormsModule,
    AuthModule,
    TravelLogApiModule,
    TeleportApiModule.forRoot(() => new Configuration({})),
    AppRoutingModule,
  ],
  providers: [TravelLogApiModule, AuthModule],
  bootstrap: [AppComponent],
})
export class AppModule {}
