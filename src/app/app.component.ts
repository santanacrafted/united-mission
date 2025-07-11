import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { PopupTemplatesComponent } from './shared/components/popup-templates/popup-templates.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, ViewportScroller } from '@angular/common';
import {
  FooterComponent,
  FooterSection,
} from './shared/components/footer/footer.component';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { filter } from 'rxjs';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,
    PopupTemplatesComponent,
    FormsModule,
    CommonModule,
    FooterComponent,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'united-mission';
  logoUrl = '/assets/images/logo.png';
  translationsReady = false;

  footerSections: FooterSection[] = [
    {
      title: 'FOOTER_QUICK_LINK_HEADER',
      links: [
        { label: 'FOOTER_QUICK_LINK_1', path: '/donate' },
        { label: 'FOOTER_QUICK_LINK_2', path: '/our-work' },
        { label: 'FOOTER_QUICK_LINK_3', path: '/contact' },
      ],
    },
    {
      title: 'FOOTER_SOCIAL_MEDIA_HEADER',
      links: [
        {
          label: 'FOOTER_SOCIAL_MEDIA_LINK_1',
          path: 'https://www.facebook.com/search/top?q=united%20mission%20international',
          external: true,
        },
        {
          label: 'FOOTER_SOCIAL_MEDIA_LINK_2',
          path: 'https://twitter.com/united_int',
          external: true,
        },
        {
          label: 'FOOTER_SOCIAL_MEDIA_LINK_3',
          path: 'https://www.instagram.com/united_mission_int/',
          external: true,
        },
      ],
    },
    {
      title: 'FOOTER_LEGAL_HEADER',
      links: [
        { label: 'FOOTER_LEGAL_LINK_1', path: '/privacy-policy' },
        { label: 'FOOTER_LEGAL_LINK_2', path: '/terms' },
      ],
    },
  ];
  isMobileMenuOpen = false;
  showFooterAndHeader = true;

  constructor(
    private translate: TranslateService,
    private router: Router,
    private viewportScroller: ViewportScroller
  ) {
    this.translate.addLangs(['en', 'es']);
    this.translate.setDefaultLang('en');
    const savedLang = localStorage.getItem('preferredLang');
    const browserLang = this.translate.getBrowserLang();
    const defaultLang =
      savedLang ?? (browserLang?.match(/en|es/) ? browserLang : 'en');

    this.translate.use(defaultLang);
    this.router.events
      .pipe(filter((event: any) => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        this.viewportScroller.scrollToPosition([0, 0]);
        this.showFooterAndHeader = !event.urlAfterRedirects.includes('/admin');
      });
  }

  toggleMobileMenu() {
    this.isMobileMenuOpen = !this.isMobileMenuOpen;
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
