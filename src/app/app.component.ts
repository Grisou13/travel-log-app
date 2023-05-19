import { Component, OnInit } from '@angular/core';
import { Input, Ripple, initTE } from 'tw-elements';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.sass'],
})
export class AppComponent implements OnInit {
  title = 'Locator';
  ngOnInit() {
    initTE({ Input, Ripple });
  }
}
