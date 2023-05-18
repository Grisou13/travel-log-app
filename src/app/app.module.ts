import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TravelLogApiModule } from './httpClients/travelLogApi/travelLogApi.module';
import { AuthModule } from './auth/auth.module';

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    TravelLogApiModule,
    AuthModule,
    BrowserModule,
    AppRoutingModule
  ],
  providers: [
    TravelLogApiModule,
    AuthModule,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
