import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  Output,
  ViewChild,
} from '@angular/core';
import { Offcanvas, Ripple, Dropdown, Animate, initTE } from 'tw-elements';

@Component({
  selector: 'app-off-canvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: ['./off-canvas.component.sass'],
})
export class OffCanvasComponent implements AfterViewInit {
  @ViewChild('sidebar') sidebar!: ElementRef<HTMLDivElement>;
  @ViewChild('backdrop') backdrop!: ElementRef<HTMLDivElement>;
  @Output() showChanged = new EventEmitter<boolean>();

  constructor() {
    initTE({ Offcanvas, Ripple, Dropdown, Animate });
  }

  onCloseRequested() {
    this.sidebar?.nativeElement.removeAttribute('data-te-offcanvas-show');
    this.backdrop?.nativeElement.classList.add('opacity-0');
    this.showChanged.emit(false);
  }

  ngAfterViewInit(): void {
    this.backdrop?.nativeElement.classList.add('opacity-0');

    this.sidebar?.nativeElement.setAttribute('data-te-offcanvas-show', 'true');
    // data-te-offcanvas-show
  }
}
