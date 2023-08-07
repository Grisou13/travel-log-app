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
  styleUrls: ['./off-canvas.component.sass'],
})
export class OffCanvasComponent implements AfterViewInit, OnDestroy {
  @ViewChild('sidebar') sidebar!: ElementRef<HTMLDivElement>;
  @ViewChild('backdrop') backdrop!: ElementRef<HTMLDivElement>;
  @Output() showChanged = new EventEmitter<boolean>();

  
  constructor() {
    initTE({ Offcanvas, Ripple, Dropdown, Animate });
  }
  ngOnDestroy(): void {
    this.sidebar.nativeElement.removeEventListener('hide.te.offcanvas', this.onCloseRequested)
  }

  onCloseRequested() {
    console.debug("hidding off canvas")
    // const off = Offcanvas.getOrCreateInstance(this.sidebar?.nativeElement);
    // off.hide();

    // // this.sidebar?.nativeElement.removeAttribute('data-te-offcanvas-show');
    // this.backdrop?.nativeElement.classList.add('opacity-0');
    this.showChanged.emit(false);
  }

  ngAfterViewInit(): void {
    
    const off = Offcanvas.getOrCreateInstance(this.sidebar?.nativeElement);
    this.sidebar?.nativeElement.addEventListener('hide.te.offcanvas', (e) => {
      this.onCloseRequested()
    });
    off.show();
    // this.sidebar?.nativeElement.setAttribute('data-te-offcanvas-show', 'true');
    // data-te-offcanvas-show
  }
}
