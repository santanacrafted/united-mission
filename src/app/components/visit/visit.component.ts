import { TranslateModule } from '@ngx-translate/core';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonComponent } from '../../shared/components/button/button.component';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-visit',
  imports: [TranslateModule, CommonModule, ButtonComponent, RouterModule],
  templateUrl: './visit.component.html',
  styleUrl: './visit.component.scss',
})
export class VisitComponent {
  today: string = new Date().toISOString().split('T')[0];
}
