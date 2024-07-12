import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { ColorScheme, LayoutService } from 'src/app/layout/service/app.layout.service';
import { MenuService } from './app.menu.service';

@Component({
    selector: 'app-topbar',
    templateUrl: './app.topbar.component.html'
})
export class AppTopbarComponent implements OnInit {

    @ViewChild('menubutton') menuButton!: ElementRef;

    get colorScheme(): ColorScheme {
        return this.layoutService.config().colorScheme;
    }

    constructor(public layoutService: LayoutService) { }

    ngOnInit() {
        console.log(this.layoutService)
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
        console.log(this.layoutService.config().colorScheme);
    }

    setDimMode() {
        this.layoutService.config.update((config) => ({
            ...config,
            colorScheme: 'dim',
        }));
        console.log(this.layoutService.config().colorScheme);
    }

}
