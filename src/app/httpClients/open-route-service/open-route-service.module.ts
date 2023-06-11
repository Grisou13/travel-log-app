import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectionsService } from './directions/directions.service';
import {
  OPEN_ROUTE_BASE_URL,
  OPEN_ROUTE_INTERCEPTORS,
} from '@httpClients/common';
import { BaseUrlInterceptor, OpenRouteHttp, baseUrl } from './open-route.http';

@NgModule({
  declarations: [],
  providers: [
    {
      provide: OPEN_ROUTE_BASE_URL,
      useFactory: baseUrl,
      deps: [],
    },
    {
      provide: OPEN_ROUTE_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    OpenRouteHttp,
  ],
  imports: [CommonModule],
})
export class OpenRouteServiceModule {}
