import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { QRCodeComponent } from 'angularx-qrcode';
import { TabsComponent } from '../../shared/components/tabs/tabs.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-give',
  imports: [CommonModule, QRCodeComponent, TabsComponent, TranslateModule],
  templateUrl: './give.component.html',
  styleUrl: './give.component.scss',
})
export class GiveComponent {
  activeTab: string = 'donorbox';

  tabs = [
    { id: 'donorbox', label: 'Donorbox' },
    { id: 'adventist', label: 'Adventist Giving' },
    { id: 'qr', label: 'QR Code' },
    { id: 'tithely', label: 'Tithe.ly' },
    { id: 'paypal', label: 'PayPal' },
    { id: 'givelify', label: 'Givelify' },
  ];

  onTabChange(tabId: string) {
    this.activeTab = tabId;
  }
}
