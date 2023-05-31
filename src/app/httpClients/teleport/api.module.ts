import {
  NgModule,
  ModuleWithProviders,
  SkipSelf,
  Optional,
} from '@angular/core';
import { Configuration } from './configuration';
import { HttpClient } from '@angular/common/http';

import { CitiesService } from './api/cities.service';
import { ContinentsService } from './api/continents.service';
import { CountriesService } from './api/countries.service';
import { FlockService } from './api/flock.service';
import { IpaddressService } from './api/ipaddress.service';
import { LocationsService } from './api/locations.service';
import { RootService } from './api/root.service';
import { TimezonesService } from './api/timezones.service';
import { UrbanAreasService } from './api/urbanAreas.service';

@NgModule({
  imports: [],
  declarations: [],
  exports: [],
  providers: [
    CitiesService,
    ContinentsService,
    CountriesService,
    FlockService,
    IpaddressService,
    LocationsService,
    RootService,
    TimezonesService,
    UrbanAreasService,
  ],
})
export class TeleportApiModule {
  public static forRoot(
    configurationFactory: () => Configuration
  ): ModuleWithProviders<TeleportApiModule> {
    return {
      ngModule: TeleportApiModule,
      providers: [{ provide: Configuration, useFactory: configurationFactory }],
    };
  }

  constructor(
    @Optional() @SkipSelf() parentModule: TeleportApiModule,
    @Optional() http: HttpClient
  ) {
    if (parentModule) {
      throw new Error(
        'ApiModule is already loaded. Import in your base AppModule only.'
      );
    }
    if (!http) {
      throw new Error(
        'You need to import the HttpClientModule in your AppModule! \n' +
          'See also https://github.com/angular/angular/issues/20575'
      );
    }
  }
}
