import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-generic-data-card',
    templateUrl: './generic-data-card.component.html',
    standalone: true,
    imports: [ButtonDirective, Ripple, NgIf],
})
export class GenericDataCardComponent {
    @Input() title: string = ''; // For the card title
    @Input() subtitle: string = ''; // For the card subtitle
    @Input() buttonLabel: string = ''; // For the button label
    @Input() buttonIcon: string = ''; // For the button icon
    @Output() buttonClick = new EventEmitter<void>(); // To handle button click events

    onButtonClick() {
        this.buttonClick.emit(); // Emit the event when the button is clicked
    }
}
