import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { map } from 'rxjs/operators';
import { User } from '../services/user.service';
import {
    Notification,
    NotificationService,
} from '../services/notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html',
})
export class AppProfileSidebarComponent implements OnInit {
    public currentUser: User | undefined = undefined;
    private notifications: Notification[] = [];
    public get unreadNotifications(): Notification[] {
        return this.notifications.filter((notif) => !notif.read);
    }

    private destroyRef = inject(DestroyRef);

    constructor(
        public layoutService: LayoutService,
        private authService: AuthService,
        private notificationService: NotificationService,
        private router: Router,
    ) {}

    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }

    ngOnInit() {
        this.authService.currentUser$
            .pipe(
                map((user) => {
                    this.currentUser = user;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.notificationService.currentUserNotifications$
            .pipe(
                map((notifications) => {
                    this.notifications = notifications;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    async markNotificationAsRead(notification: Notification) {
        if (!this.currentUser) return;
        await this.notificationService.readNotification(
            this.currentUser._id,
            notification._id,
        );
    }

    async logoutAndGoToLogin() {
        await this.authService.logOut();
        await this.router.navigateByUrl('/auth/login');
        this.layoutService.hideProfileSidebar();
    }
}
