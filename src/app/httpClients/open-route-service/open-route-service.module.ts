import { APP_INITIALIZER, NgModule } from '@angular/core';
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
import { PoisService } from './pois/pois.service';

@NgModule({
  declarations: [],
  providers: [
    SearchService,
    DirectionsService,
    PoisService,
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
    {
      provide: APP_INITIALIZER,
      multi: true,
      deps: [PoisService],
      useFactory: (poiService: PoisService) => () =>
        poiService.fetchPoiCategories(),
    },
    OpenRouteHttp,
  ],
  imports: [CommonModule],
})
export class OpenRouteServiceModule {}
