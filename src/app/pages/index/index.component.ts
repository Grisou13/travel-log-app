import { Component } from '@angular/core';
import { LogoComponent } from '@shared/components/logo/logo.component';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: ['./index.component.sass'],
  standalone: true,
  imports: [LogoComponent],
})
export class IndexComponent {}
