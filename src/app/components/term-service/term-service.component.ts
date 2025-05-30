import { Component } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { HeaderComponent } from '../../shared/components/header/header.component';

@Component({
  selector: 'app-term-service',
  imports: [TranslateModule, HeaderComponent],
  templateUrl: './term-service.component.html',
  styleUrl: './term-service.component.scss',
})
export class TermServiceComponent {
  logoUrl: string = '/assets/images/logo.png';
}
