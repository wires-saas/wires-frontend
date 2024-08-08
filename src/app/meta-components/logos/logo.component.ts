import { Component } from '@angular/core';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
    templateUrl: './logo.component.html',
    selector: 'app-logo',
})
export class LogoComponent {

    get lightMode(): boolean {
        return this.layoutService.isLightMode();
    }

    constructor(private layoutService: LayoutService) {
    }


}
