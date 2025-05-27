import { Component } from '@angular/core';
import { InfoCardComponent } from '../../shared/components/info-card/info-card.component';

@Component({
  selector: 'app-info-cards',
  imports: [InfoCardComponent],
  templateUrl: './info-cards.component.html',
  styleUrl: './info-cards.component.scss',
})
export class InfoCardsComponent {}
