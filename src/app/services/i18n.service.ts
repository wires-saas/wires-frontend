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

    async setLocale(locale: SupportedLocales) {
        if (locale === this.selectedLocale) {
            console.debug('Locale ' + locale + ' already selected');
            return;
        }

        console.debug('Setting locale to ' + locale);
        this.selectedLocale = locale;
        localStorage.setItem('locale', locale);
        window.location.assign('/' + locale);
    }

}
