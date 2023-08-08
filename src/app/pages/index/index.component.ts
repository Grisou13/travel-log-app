import { Component } from '@angular/core';
import { LogoComponent } from '@shared/components/logo/logo.component';
import { SharedModule } from '@shared/shared.module';

@Component({
  selector: 'app-index',
  templateUrl: './index.component.html',
  styleUrls: [],
  standalone: true,
  imports: [SharedModule],
})
export class IndexComponent {}
