import { NgModule, inject } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { authGuard } from './guards/auth-guard.guard';

const routes: Routes = [
  {
    'path': "/app",
    canActivate: [() => authGuard()]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
