import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
  ViewChild,
} from '@angular/core';
import { Offcanvas, Ripple, Dropdown, Animate, initTE } from 'tw-elements';

@Component({
  selector: 'app-off-canvas',
  templateUrl: './off-canvas.component.html',
  styleUrls: [],
})
export class OffCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: ElementRef<HTMLDivElement>;
  @ViewChild('backdrop') backdrop!: ElementRef<HTMLDivElement>;
  @Output() onClose = new EventEmitter<boolean>();

  constructor() {
    initTE({ Offcanvas, Ripple, Dropdown, Animate });
  }
  ngOnDestroy(): void {
    this.sidebar.nativeElement.removeEventListener(
      'hide.te.offcanvas',
      this.onCloseRequested
    );
  }

  onCloseRequested() {
    console.debug('hidding off canvas');
    // const off = Offcanvas.getOrCreateInstance(this.sidebar?.nativeElement);
    // off.hide();

    // // this.sidebar?.nativeElement.removeAttribute('data-te-offcanvas-show');
    // this.backdrop?.nativeElement.classList.add('opacity-0');
    this.onClose.emit(false);
  }

  open() {
    const off = Offcanvas.getOrCreateInstance(this.sidebar?.nativeElement);
    off.show();
  }

  close() {
    const off = Offcanvas.getOrCreateInstance(this.sidebar?.nativeElement);
    off.close();
  }

  ngAfterViewInit(): void {
    this.open();
    this.sidebar?.nativeElement.addEventListener('hide.te.offcanvas', (e) => {
      this.onCloseRequested();
    });
  }
}
