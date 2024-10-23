import { Component, Input } from '@angular/core';
import { DatePipe, NgForOf, NgIf } from '@angular/common';
import { GenericSquareCardComponent } from '../generic-square-card/generic-square-card.component';

export interface SquareCard {
    icon?: string;
    title?: string;
    description?: string | number;
}

@Component({
    selector: 'app-generic-square-cards-row',
    templateUrl: './generic-square-cards-row.component.html',
    standalone: true,
    imports: [
        DatePipe,
        NgIf,
        GenericSquareCardComponent,
        NgForOf,
    ]
})
export class GenericSquareCardsRowComponent {
    @Input() cards: SquareCard[] = [];
}
