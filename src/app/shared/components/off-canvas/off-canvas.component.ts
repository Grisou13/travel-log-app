import { AfterViewInit, Component, ElementRef, EventEmitter, Output, ViewChild } from '@angular/core';
import { Offcanvas, Ripple, Dropdown, initTE } from 'tw-elements';

@Component({
  selector: 'app-off-canvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.sass'],
})
export class OffCanvasComponent implements AfterViewInit {
  @ViewChild("sidebar") sidebar!: ElementRef<HTMLDivElement>;
  constructor() {}
  @Output() close = new EventEmitter()
  onClose(){
    this.close.emit();
    this.sidebar.nativeElement.removeAttribute('data-te-offcanvas-show')
  }
  ngAfterViewInit(): void {
    initTE({ Offcanvas, Ripple, Dropdown });
    setTimeout(() => this.sidebar.nativeElement.setAttribute('data-te-offcanvas-show', 'true'), 500);
    // data-te-offcanvas-show
  }
}
