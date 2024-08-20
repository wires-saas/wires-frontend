import { Component, DestroyRef, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { ColorScheme, LayoutService } from 'src/app/layout/service/app.layout.service';
import { MenuItem } from 'primeng/api';
import { I18nService, SupportedLocales } from '../services/i18n.service';
import { Notification, NotificationService } from '../services/notification.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent implements OnInit {

    @ViewChild('menubutton') menuButton!: ElementRef;

    languages: MenuItem[] = [];

    notifications: Notification[] = [];

    private destroyRef = inject(DestroyRef);

    get colorScheme(): ColorScheme {
        return this.layoutService.config().colorScheme;
    }

    get currentCountryCode(): string {
        return this.i18nService.getCountryCode();
    }

    get notificationsBadge(): string {
        return this.notifications.length > 9 ? '' : this.notifications.length.toString(10);
    }

    constructor(public layoutService: LayoutService,
                private i18nService: I18nService,
                private notificationService: NotificationService) { }

    ngOnInit() {
        this.buildLanguagesMenu();

        this.notificationService.currentUserNotifications$.pipe(
            map((notifications) => {
                this.notifications = notifications;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    private buildLanguagesMenu() {
        this.languages = [
            {
                label: 'Français',
                countryCode: 'fr',
                disabled: this.i18nService.getLocale() === SupportedLocales.FR,
                isActive: this.i18nService.getLocale() === SupportedLocales.FR,
                command: async () => {
                    await this.i18nService.setLocale(SupportedLocales.FR, true);
                    this.buildLanguagesMenu();
                }
            },
            {
                label: 'English',
                countryCode: 'uk',
                disabled: this.i18nService.getLocale() === SupportedLocales.EN,
                isActive: this.i18nService.getLocale() === SupportedLocales.EN,
                command: async () => {
                    await this.i18nService.setLocale(SupportedLocales.EN, true);
                    this.buildLanguagesMenu();
                }
            }
        ];
    }

    onMenuButtonClick() {
        this.layoutService.onMenuToggle();
    }

    onProfileButtonClick() {
        this.layoutService.showProfileSidebar();
    }
    onConfigButtonClick() {
        this.layoutService.showConfigSidebar();
    }

    setLightMode() {
        this.layoutService.switchToLightMode();
    }

    setDimMode() {
        this.layoutService.switchToDimMode();
    }

}
