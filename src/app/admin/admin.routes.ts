import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { UsersComponent } from './components/users/users.component';
import { GalleryManagementComponent } from './components/gallery-management/gallery-management.component';
import { DonationsComponent } from './components/donations/donations.component';
import { AuthGuard } from '../shared/gaurds/auth.guard';
import { RedirectIfAuthenticatedGuard } from '../shared/gaurds/authenticated.guard';
import { RegisterComponent } from './components/register/register.component';
import { AdminUsersComponent } from './components/admin-users/admin-users.component';
import { AdminOnlyGuard } from '../shared/gaurds/admin-only.guard';

export const adminRoutes: Routes = [
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [RedirectIfAuthenticatedGuard],
  },
  {
    path: 'register',
    component: RegisterComponent,
    canActivate: [RedirectIfAuthenticatedGuard],
  },
  {
    path: 'users',
    component: AdminUsersComponent,
    canActivate: [AuthGuard, AdminOnlyGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'gallery-management',
    component: GalleryManagementComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'donations',
    component: DonationsComponent,
    canActivate: [AuthGuard],
  },
  {
    path: 'not-authorized',
    loadComponent: () =>
      import('./components/not-authorized/not-authorized.component').then(
        (m) => m.NotAuthorizedComponent
      ),
  },
];
