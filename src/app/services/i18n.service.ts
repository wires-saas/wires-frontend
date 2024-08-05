import { DestroyRef, inject, Injectable } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs';

export enum SupportedLocales {
    FR = 'fr',
    EN = 'en',
}

@Injectable({
    providedIn: 'root',
})
export class I18nService {

    private selectedLocale: SupportedLocales = SupportedLocales.FR;

    private destroyRef = inject(DestroyRef);

    constructor(private router: Router) {
        const preferredLocale = localStorage.getItem('locale');

        if (preferredLocale && preferredLocale === SupportedLocales.EN || preferredLocale === SupportedLocales.FR) {
            this.selectedLocale = preferredLocale;
        }

        console.log(this.selectedLocale);

        // Listening on URL changes to update the selected locale
        this.router.events.pipe(
            filter((event) => event instanceof NavigationEnd),
            map(async (event) => {
                console.log(event);
                if ((event as NavigationEnd).urlAfterRedirects.startsWith('/en')) {
                    await this.setLocale(SupportedLocales.EN, false);
                } else if ((event as NavigationEnd).urlAfterRedirects.startsWith('/fr')) {
                    await this.setLocale(SupportedLocales.FR, false);
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
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
        if (locale === this.selectedLocale) {
            console.debug('Locale ' + locale + ' already selected');
            return;
        }

        console.debug('Setting locale to ' + locale);
        this.selectedLocale = locale;
        localStorage.setItem('locale', locale);
        if (redirect) window.location.assign('/' + locale);
    }

}
