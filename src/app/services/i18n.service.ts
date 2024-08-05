import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

export enum SupportedLocales {
    FR = 'fr',
    EN = 'en',
}

@Injectable({
    providedIn: 'root',
})
export class I18nService {

    private selectedLocale: SupportedLocales = SupportedLocales.FR;

    constructor(private router: Router) {
        const preferredLocale = localStorage.getItem('locale');

        if (preferredLocale && preferredLocale === SupportedLocales.EN || preferredLocale === SupportedLocales.FR) {
            this.selectedLocale = preferredLocale;
        }

        // On app start, check the URL to set the locale

        const url = window.location.pathname;
        if (url.startsWith('/en')) {
            this.setLocale(SupportedLocales.EN, false).then(() => {
                // ...
            });
        } else if (url.startsWith('/fr')) {
            this.setLocale(SupportedLocales.FR, false).then(() => {
                // ...
            });
        }
    }

    getLocale(): SupportedLocales {
        return this.selectedLocale;
    }

    getCountryCode(): string {
        switch (this.selectedLocale) {
            case SupportedLocales.FR:
                return 'fr';
            case SupportedLocales.EN:
                return 'uk';
            default:
                return 'fr';
        }
    }

    async setLocale(locale: SupportedLocales, redirect: boolean) {
        if (locale === this.selectedLocale) return;

        this.selectedLocale = locale;
        localStorage.setItem('locale', locale);
        if (redirect) window.location.assign('/' + locale);
    }

}
