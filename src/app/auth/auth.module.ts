import { APP_INITIALIZER, ModuleWithProviders, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service.service';
import { ReactiveFormsModule } from '@angular/forms';
import { TravelLogApiModule } from '../httpClients/travelLogApi/travelLogApi.module';
import { routes } from './auth-routing.module';
import { AuthLayoutComponent } from './components/auth-layout/auth-layout.component';
import { SignupComponent } from './pages/signup/signup.component';
import { LoginComponent } from './pages/login/login.component';
import { RouterModule } from '@angular/router';
import { SharedModule } from '@shared/shared.module';

const initAuth = (authService: AuthService) => () => {
  return authService.boot();
};

@NgModule({
  declarations: [SignupComponent, LoginComponent],
  imports: [SharedModule, RouterModule.forChild(routes), TravelLogApiModule],
  exports: [RouterModule],
})
export class AuthModule {
  static forRoot(): ModuleWithProviders<AuthModule> {
    return {
      ngModule: AuthModule,

      providers: [
        AuthService,
        /*{
          provide: APP_INITIALIZER,
          useFactory: initAuth,
          deps: [AuthService],
          multi: true,
        },*/
      ],
    };
  }
}
