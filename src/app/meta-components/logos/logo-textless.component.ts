import { Component, Input } from '@angular/core';
import { LayoutService } from '../../layout/service/app.layout.service';

@Component({
    templateUrl: './logo-textless.component.html',
    selector: 'app-logo-textless',
})
export class LogoTextlessComponent {

    @Input() withBorder: boolean = false;

}
