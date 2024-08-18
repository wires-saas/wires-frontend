import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorScheme, LayoutService } from 'src/app/layout/service/app.layout.service';
import { MenuItem } from 'primeng/api';
import { I18nService, SupportedLocales } from '../services/i18n.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent implements OnInit {

    @ViewChild('menubutton') menuButton!: ElementRef;

    languages: MenuItem[] = [];

    get colorScheme(): ColorScheme {
        return this.layoutService.config().colorScheme;
    }

    get currentCountryCode(): string {
        return this.i18nService.getCountryCode();
    }

    constructor(public layoutService: LayoutService, private i18nService: I18nService) { }

    ngOnInit() {
        this.buildLanguagesMenu();
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
