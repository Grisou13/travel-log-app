import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './auth/guards/auth-guard.guard';
import { AppComponent } from './app.component';
import { anonGuard } from './auth/guards/anon-guard.guard';

const routes: Routes = [
  {
    'path': "app",
    canActivate: [authGuard],
    component: AppComponent
  },
  {
    'path': "login",
    canActivate: [anonGuard],
    component: AppComponent
  },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
