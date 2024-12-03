import { Component, Input } from '@angular/core';
import { TagModule } from 'primeng/tag';

@Component({
    selector: 'app-static-square-card',
    templateUrl: './static-square-card.component.html',
    imports: [TagModule],
    standalone: true,
})
export class StaticSquareCardComponent {
    @Input() text!: string;
}
