import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TravelLogApiModule } from './httpClients/travelLogApi/travelLogApi.module';
import { AuthModule } from './auth/auth.module';
import { Configuration, TeleportApiModule } from './httpClients/teleport';
import { SharedModule } from '@shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    TeleportApiModule.forRoot(() => new Configuration({})),
    TravelLogApiModule,
    SharedModule.forRoot(),
    AuthModule.forRoot(),
    DashboardModule.forRoot(),
  ],
  providers: [
    TravelLogApiModule,
    TeleportApiModule,
    SharedModule,
    AuthModule,
    DashboardModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
