import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectionsService } from './directions/directions.service';
import { SearchService } from './search/search.service';
import {
  OPEN_ROUTE_BASE_URL,
  OPEN_ROUTE_INTERCEPTORS,
} from '@httpClients/common';
import {
  ApiTokenInterceptor,
  BaseUrlInterceptor,
  OpenRouteHttp,
  baseUrl,
} from './open-route.http';

@NgModule({
  declarations: [],
  providers: [
    SearchService,
    DirectionsService,
    {
      provide: OPEN_ROUTE_BASE_URL,
      useFactory: baseUrl,
      deps: [],
    },
    {
      provide: OPEN_ROUTE_INTERCEPTORS,
      useClass: ApiTokenInterceptor,
      multi: true,
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
