import { Component } from '@angular/core';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
    templateUrl: './logo-phrase.component.html',
    selector: 'app-logo-phrase',
})
export class LogoPhraseComponent {

    get lightMode(): boolean {
        return this.layoutService.isLightMode();
    }

    constructor(private layoutService: LayoutService) {
    }


}
