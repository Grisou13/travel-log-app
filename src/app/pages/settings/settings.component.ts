import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  constructor(private location: Location) {}
  navigateBack() {
    this.location.back();
  }
}
