import { CommonModule } from '@angular/common';
import { Component, Input, Output, EventEmitter } from '@angular/core';
import { ButtonModule } from 'primeng/button';


@Component({
    selector: 'app-error-card',
    templateUrl: './error-card.component.html',
    standalone: true,
    imports: [
        CommonModule,
        ButtonModule,
    ],
})
export class ErrorCardComponent {
    @Input() title!: string;
    @Input() description!: string;
    @Input() buttonLabel?: string;
    @Output() buttonClick = new EventEmitter<void>();
} 