import { Component, Input } from '@angular/core';
import { DatePipe, NgIf } from '@angular/common';

@Component({
    selector: 'app-generic-square-card',
    templateUrl: './generic-square-card.component.html',
    standalone: true,
    imports: [
        DatePipe,
        NgIf
    ]
})
export class GenericSquareCardComponent {
    @Input() title: string | undefined = '';
    @Input() description: string | number | undefined = '';
    @Input() icon: string | undefined = '';

    @Input() animationClass: string | undefined = 'animation-duration-500';
}
