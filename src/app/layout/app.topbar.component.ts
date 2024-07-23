import { Component, ElementRef, ViewChild } from '@angular/core';
import { ColorScheme, LayoutService } from 'src/app/layout/service/app.layout.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent {

    @ViewChild('menubutton') menuButton!: ElementRef;

    get colorScheme(): ColorScheme {
        return this.layoutService.config().colorScheme;
    }

    constructor(public layoutService: LayoutService) { }

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
