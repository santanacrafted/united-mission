import { Component } from '@angular/core';
import { NavigationEnd, RouterOutlet, Router } from '@angular/router';
import { PopupTemplatesComponent } from './shared/components/popup-templates/popup-templates.component';
import { FormsModule } from '@angular/forms';
import { CommonModule, ViewportScroller } from '@angular/common';
import {
  FooterComponent,
  FooterSection,
} from './shared/components/footer/footer.component';
import { HeaderComponent } from './shared/components/header/header.component';
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
    HeaderComponent,
    TranslateModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  title = 'church-website-template-basic';
  logoUrl = '/logos/church-logo.png';
  translationsReady = false;

  footerSections: FooterSection[] = [
    {
      title: 'FOOTER_QUICK_LINK_HEADER',
      links: [
        { label: 'FOOTER_QUICK_LINK_2', path: '/give' },
        { label: 'FOOTER_QUICK_LINK_3', path: '/contact' },
        { label: 'FOOTER_QUICK_LINK_4', path: '/kids-programs' },
      ],
    },
    {
      title: 'FOOTER_SOCIAL_MEDIA_HEADER',
      links: [
        { label: 'FOOTER_SOCIAL_MEDIA_LINK_1' },
        {
          label: 'FOOTER_SOCIAL_MEDIA_LINK_2',
          path: 'https://www.youtube.com/@SantanaCrafted',
          external: true,
        },
        { label: 'FOOTER_SOCIAL_MEDIA_LINK_3' },
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
      .subscribe(() => {
        this.viewportScroller.scrollToPosition([0, 0]);
      });
  }

  switchLang(lang: string) {
    this.translate.use(lang);
  }
}
