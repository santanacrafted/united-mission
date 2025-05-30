import { Component } from '@angular/core';
import { HeaderComponent } from '../../shared/components/header/header.component';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-get-involved',
  imports: [HeaderComponent, RouterLink],
  templateUrl: './get-involved.component.html',
  styleUrl: './get-involved.component.scss',
})
export class GetInvolvedComponent {
  logoUrl: string = '/assets/images/logo.png';
}
