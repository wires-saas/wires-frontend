import { Component, Input } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-generic-layout-single-instance',
    templateUrl: './generic-layout-single-instance.component.html',
    standalone: true,
    imports: [ButtonDirective, Ripple, RouterLink],
})
export class GenericLayoutSingleInstanceComponent {
    @Input() title: string = '';
    @Input() buttonLabel: string = '';
    @Input() buttonIcon: string = '';
    @Input() buttonLink: string[] = [];
}
