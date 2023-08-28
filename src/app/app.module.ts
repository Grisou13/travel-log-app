import { ErrorHandler, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { TravelLogApiModule } from './httpClients/travelLogApi/travelLogApi.module';
import { AuthModule } from './auth/auth.module';
import { SharedModule } from '@shared/shared.module';
import { DashboardModule } from './dashboard/dashboard.module';
import { OpenRouteServiceModule } from '@httpClients/open-route-service/open-route-service.module';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { AppErrorHandler } from '@shared/app-error-handler';
import { ErrorHandlingInterceptor } from '@shared/error-handling.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { ToastrModule } from 'ngx-toastr';
import { ErrorHandlerService } from '@shared/error-handler.service';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { SettingsComponent } from './pages/settings/settings.component';
import { SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';

@NgModule({
  declarations: [AppComponent, SettingsComponent],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    ToastrModule.forRoot({}),
    SweetAlert2Module.forRoot({}),
    OpenRouteServiceModule,
    TravelLogApiModule,
    SharedModule,
    AuthModule.forRoot(),
    DashboardModule.forRoot(),
  ],
  providers: [
    ErrorHandlerService,
    {
      provide: HTTP_INTERCEPTORS,
      useClass: ErrorHandlingInterceptor,
      multi: true,
    },
    {
      provide: ErrorHandler,
      useClass: AppErrorHandler,
    },
    TravelLogApiModule,
    AuthModule,
    DashboardModule,
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
