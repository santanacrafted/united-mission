import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { AboutComponent } from './components/about/about.component';
import { ContactComponent } from './components/contact/contact.component';
import { GalleryComponent } from './components/gallery/gallery.component';
import { PrivacyPolicyComponent } from './components/privacy-policy/privacy-policy.component';
import { TermServiceComponent } from './components/term-service/term-service.component';
import { DonateComponent } from './components/donate/donate.component';
import { GetInvolvedComponent } from './components/get-involved/get-involved.component';
import { UsersComponent } from './admin/components/users/users.component';
import { AdminComponent } from './admin/admin.component';

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
    path: 'get-involved',
    component: GetInvolvedComponent,
  },
  {
    path: 'donate',
    component: DonateComponent,
  },
  {
    path: 'our-work',
    component: GalleryComponent,
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
    path: 'admin',
    component: AdminComponent,
    loadChildren: () =>
      import('./admin/admin.routes').then((m) => m.adminRoutes),
  },
];
