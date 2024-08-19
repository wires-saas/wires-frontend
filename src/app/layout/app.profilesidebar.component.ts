import { Component, OnDestroy, OnInit } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Router } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { Subject, takeUntil } from 'rxjs';
import { map } from 'rxjs/operators';
import { User } from '../services/user.service';
import { Notification, NotificationService } from '../services/notification.service';

@Component({
    selector: 'app-profilemenu',
    templateUrl: './app.profilesidebar.component.html'
})
export class AppProfileSidebarComponent implements OnInit, OnDestroy {

    private unsubscribe$: Subject<void> = new Subject<void>();

    public currentUser: User | undefined = undefined;
    public notifications: Notification[] = [];

    constructor(public layoutService: LayoutService,
                private authService: AuthService,
                private notificationService: NotificationService,
                private router: Router) { }

    get visible(): boolean {
        return this.layoutService.state.profileSidebarVisible;
    }

    set visible(_val: boolean) {
        this.layoutService.state.profileSidebarVisible = _val;
    }

    ngOnInit() {
        this.authService.currentUser$.pipe(
            map(async (user) => {
                this.currentUser = user;
                this.notifications = await this.notificationService.getNotifications();
            }),
            takeUntil(this.unsubscribe$)
        ).subscribe();
    }

    ngOnDestroy() {
        this.unsubscribe$.next();
        this.unsubscribe$.complete();
    }

    async logoutAndGoToLogin() {
        await this.authService.logOut();
        await this.router.navigateByUrl('/auth/login');
        this.layoutService.hideProfileSidebar();
    }
}
