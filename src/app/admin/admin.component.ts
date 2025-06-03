import { CommonModule } from '@angular/common';
import { Component, HostListener, inject } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';
import { AuthService } from '../shared/services/auth.service';
import { authState, User } from '@angular/fire/auth';
import { Observable } from 'rxjs';
import { Auth } from '@angular/fire/auth';
import { NotificationService } from '../shared/services/notifications.service';
import { ClickOutsideModule } from 'ng-click-outside';

@Component({
  selector: 'app-admin',
  imports: [CommonModule, RouterOutlet, RouterLink, ClickOutsideModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.scss',
})
export class AdminComponent {
  today = new Date();
  isSidebarCollapsed = false;
  screenWidth = window.innerWidth;
  user$?: Observable<User | null>;
  showNotifications = false;
  notifications: any[] = [];
  userInfo: {
    displayName: string;
    email: string;
    roles: string[];
    uid: string;
  } | null = null;
  showUserMenu = false;
  userPending: boolean = false;

  constructor(
    private authService: AuthService,
    private router: Router,
    private auth: Auth,
    private notificationService: NotificationService
  ) {
    this.user$ = authState(this.auth);
    this.user$.subscribe((user) => {
      if (user) {
        user.getIdTokenResult().then((result: any) => {
          console.log(result);
          this.userPending = result.claims.roles ? false : true;
          this.userInfo = {
            displayName: user.displayName || '',
            email: user.email || '',
            roles: result.claims.roles || [],
            uid: user.uid,
          };
        });
      }
    });
  }

  ngOnInit(): void {
    this.notificationService
      .getAdminNotifications()
      .subscribe((notifications) => {
        this.notifications = notifications;
      });
    this.updateSidebarState();
  }

  unseenCount(): number {
    if (!this.notifications || !this.userInfo?.uid) return 0;
    return this.notifications.filter(
      (n) => !n.seenBy?.includes(this.userInfo?.uid)
    ).length;
  }

  toggleSidebar(): void {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event): void {
    this.screenWidth = (event.target as Window).innerWidth;
    this.updateSidebarState();
  }

  private updateSidebarState(): void {
    // Optional: auto-close sidebar on small screens
    if (this.screenWidth < 768) {
      this.isSidebarCollapsed = true;
    }
  }

  onLogout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/admin/login']);
    });
  }

  markAsSeen(notificationId: string) {
    if (!this.userInfo?.uid) return;

    this.notificationService
      .markAsSeen(notificationId, this.userInfo?.uid)
      .subscribe({
        next: () => {
          // Optional: update UI immediately
          this.notifications = this.notifications.filter(
            (n) => n.id !== notificationId
          );
        },
        error: (err: any) =>
          console.error('Failed to mark notification as seen:', err),
      });
  }

  handleNotificationClick(notification: any) {
    console.log(notification);
    const type = notification.type;

    switch (type) {
      case 'user-registration':
        this.router.navigate(['/admin/users']);
        break;
    }

    this.showNotifications = false;
    this.markAsSeen(notification.id);
  }
}
