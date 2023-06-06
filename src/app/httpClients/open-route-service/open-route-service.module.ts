import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DirectionsService } from './directions/directions.service';



@NgModule({
  declarations: [],
  providers: [DirectionsService],
  imports: [
    CommonModule
  ]
})
export class OpenRouteServiceModule { }
