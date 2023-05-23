import { APP_INITIALIZER, NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service.service';
import { authGuard } from './guards/auth-guard.guard';
import { FormsModule } from '@angular/forms';
import { TravelLogApiModule } from '../httpClients/travelLogApi/travelLogApi.module';
import { Router } from '@angular/router';

const initAuth = (authService: AuthService) => () => {
  return authService.boot();
};

@NgModule({
  declarations: [],
  imports: [CommonModule, TravelLogApiModule],
  providers: [
    Router,
    AuthService,
    {
      provide: APP_INITIALIZER,
      useFactory: initAuth,
      deps: [AuthService],
      multi: true,
    },
  ],
  exports: [CommonModule, FormsModule],
})
export class AuthModule {}
