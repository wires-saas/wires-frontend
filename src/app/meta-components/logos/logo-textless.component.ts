import { Component, Input } from '@angular/core';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
    templateUrl: './logo-textless.component.html',
    selector: 'app-logo-textless',
})
export class LogoTextlessComponent {
    @Input() withBorder: boolean = false;
    @Input() small: boolean = false;

    get lightMode(): boolean {
        return this.layoutService.isLightMode();
    }

    constructor(private layoutService: LayoutService) {}
}
