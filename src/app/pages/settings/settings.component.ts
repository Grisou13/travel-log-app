import { Component } from '@angular/core';
import { Location } from '@angular/common';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
})
export class SettingsComponent {
  constructor(private location: Location) {}
  navigateBack() {
    this.location.back();
  }
}
