import { Component, Input } from '@angular/core';

@Component({
    templateUrl: './logo-textless.component.html',
    selector: 'app-logo-textless',
})
export class LogoTextlessComponent {
    @Input() withBorder: boolean = false;
}
