import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';

@Component({
    selector: 'app-generic-data-card',
    templateUrl: './generic-data-card.component.html',
    standalone: true,
    imports: [
        ButtonDirective,
        Ripple
    ]
})
export class GenericDataCardComponent {
    @Input() title: string = '';    // For the card title
    @Input() buttonLabel: string = '';  // For the button label
    @Input() buttonIcon: string = '';     // For the button icon
    @Output() buttonClick = new EventEmitter<void>();  // To handle button click events

    onButtonClick() {
        this.buttonClick.emit();  // Emit the event when the button is clicked
    }
}
