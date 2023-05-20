import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './services/auth-service.service';
import { authGuard } from './guards/auth-guard.guard';
import { FormsModule } from '@angular/forms';
import { TravelLogApiModule } from '../httpClients/travelLogApi/travelLogApi.module';
import { Router } from '@angular/router';

@NgModule({
  declarations: [],
  imports: [CommonModule, TravelLogApiModule],
  providers: [Router, AuthService],
  exports: [CommonModule, FormsModule],
})
export class AuthModule {}
