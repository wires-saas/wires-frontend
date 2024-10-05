import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-empty-card',
    templateUrl: './empty-card.component.html',
    standalone: true,
    imports: [
    ]
})
export class EmptyCardComponent {

    @Input() entity!: string;

}
