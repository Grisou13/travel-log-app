import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { WithLoadingPipe } from './pipes/with-loading.pipe';
import { CitiesSearchComponent } from './components/cities-search/cities-search.component';
import { LogoComponent } from './components/logo/logo.component';
import { HighlightDirective } from './directives/highlight.directive';
import { WithLoadingStatusPipe } from './pipes/with-loading-status.pipe';
import { MapComponent } from './components/map/map.component';

@NgModule({
  declarations: [
    WithLoadingPipe,
    CitiesSearchComponent,
    LogoComponent,
    HighlightDirective,
    WithLoadingStatusPipe,
    MapComponent,
  ],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [
    CitiesSearchComponent,
    LogoComponent,
    WithLoadingPipe,
    CommonModule,
    ReactiveFormsModule,
    HighlightDirective,
    WithLoadingStatusPipe,
    MapComponent,
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
