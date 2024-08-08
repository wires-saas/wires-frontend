import { Component, Input } from '@angular/core';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
    templateUrl: './logo.component.html',
    selector: 'app-logo',
})
export class LogoComponent {

    @Input() withBorder: boolean = false;

    get lightMode(): boolean {
        return this.layoutService.isLightMode();
    }

    constructor(private layoutService: LayoutService) {
    }


}
