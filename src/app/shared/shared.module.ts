import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WithLoadingPipe } from './pipes/with-loading.pipe';
import { CitiesSearchComponent } from './components/cities-search/cities-search.component';
import { LogoComponent } from './components/logo/logo.component';
import { HighlightDirective } from './directives/highlight.directive';
import { WithLoadingStatusPipe } from './pipes/with-loading-status.pipe';
import { MapComponent } from './components/map/map.component';
import { LeafletModule } from '@asymmetrik/ngx-leaflet';
import { GeolocationService } from './services/geolocation/geolocation.service';
import { HighlightPipe } from './pipes/highlight.pipe';
import { LocationSearchComponent } from './components/location-search/location-search.component';
import { OffCanvasComponent } from './components/off-canvas/off-canvas.component';

@NgModule({
  declarations: [
    WithLoadingPipe,
    CitiesSearchComponent,
    LogoComponent,
    HighlightDirective,
    WithLoadingStatusPipe,
    MapComponent,
    HighlightPipe,
    LocationSearchComponent,
    OffCanvasComponent,
  ],
  providers: [GeolocationService],
  imports: [CommonModule, ReactiveFormsModule, LeafletModule],
  exports: [
    CommonModule,
    ReactiveFormsModule,
    LeafletModule,
    CitiesSearchComponent,
    LogoComponent,
    WithLoadingPipe,
    HighlightDirective,
    WithLoadingStatusPipe,
    MapComponent,
    LocationSearchComponent,
    OffCanvasComponent,
  ],
})
export class SharedModule {
  /*static forRoot(): ModuleWithProviders<SharedModule> {
    return {
      ngModule: SharedModule,

      providers: [
        /*{
          provide: APP_INITIALIZER,
          useFactory: initAuth,
          deps: [AuthService],
          multi: true,
        },*
      ],
    };
  }*/
}
