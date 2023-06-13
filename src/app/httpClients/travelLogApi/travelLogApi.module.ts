import { NgModule } from '@angular/core';

import { HttpClientModule } from '@angular/common/http';
import {
  BaseUrlInterceptor,
  BearerAuthTokenInterceptor,
  TravelLogHttp,
  baseUrl,
} from './travel-log.http';
import { TravelLogService } from './travel-log.service';
import {
  TRAVEL_LOG_BASE_API_URL,
  TRAVEL_LOG_HTTP_INTERCEPTORS,
} from '@httpClients/common';

@NgModule({
  imports: [HttpClientModule],
  providers: [
    {
      provide: TRAVEL_LOG_BASE_API_URL,
      useFactory: baseUrl,
      deps: [],
    },
    {
      provide: TRAVEL_LOG_HTTP_INTERCEPTORS,
      useClass: BearerAuthTokenInterceptor,
      multi: true,
    },
    {
      provide: TRAVEL_LOG_HTTP_INTERCEPTORS,
      useClass: BaseUrlInterceptor,
      multi: true,
    },
    TravelLogHttp,
    TravelLogService,
  ],
  exports: [],
})
export class TravelLogApiModule {}
