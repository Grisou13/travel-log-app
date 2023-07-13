import { AfterViewInit, Component, ViewChild } from '@angular/core';
import { Offcanvas, Ripple, Dropdown, initTE } from 'tw-elements';

@Component({
  selector: 'app-off-canvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.sass'],
})
export class OffCanvasComponent implements AfterViewInit {
  constructor() {}
  ngAfterViewInit(): void {
    initTE({ Offcanvas, Ripple, Dropdown });
  }
}
