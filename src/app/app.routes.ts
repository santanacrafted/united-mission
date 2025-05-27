import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { InfoCardsComponent } from './components/info-cards/info-cards.component';
import { CalendarComponent } from './components/calendar/calendar.component';
import { VisitComponent } from './components/visit/visit.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { MinistriesComponent } from './components/ministries/ministries.component';
import { SermonsComponent } from './components/sermons/sermons.component';
import { GiveComponent } from './components/give/give.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermServiceComponent } from './components/term-service/term-service.component';
import { KidsProgramsComponent } from './components/kids-programs/kids-programs.component';

export const routes: Routes = [
  {
    path: '',
    component: HomeComponent,
  },
  {
    path: 'about',
    component: AboutComponent,
  },
  {
    path: 'contact',
    component: ContactComponent,
  },
  {
    path: 'info-cards',
    component: InfoCardsComponent,
  },
  {
    path: 'calendar',
    component: CalendarComponent,
  },
  {
    path: 'visit',
    component: VisitComponent,
  },
  {
    path: 'gallery',
    component: GalleryComponent,
  },
  {
    path: 'ministries',
    component: MinistriesComponent,
  },
  {
    path: 'sermons',
    component: SermonsComponent,
  },
  {
    path: 'give',
    component: GiveComponent,
  },
  {
    path: 'privacy-policy',
    component: PrivacyPolicyComponent,
  },
  {
    path: 'terms',
    component: TermServiceComponent,
  },
  {
    path: 'kids-programs',
    component: KidsProgramsComponent,
  },
];
