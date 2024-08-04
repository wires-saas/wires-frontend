import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorScheme, LayoutService } from 'src/app/layout/service/app.layout.service';
import { MenuItem } from 'primeng/api';

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

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        this.languages = [
            { label: 'Français', countryCode: 'fr' },
            { label: 'English', countryCode: 'uk' },
            { label: 'Español', countryCode: 'es' },
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

        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: 'light',
        }));
    }

    setDimMode() {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: 'dim',
        }));
    }

}
