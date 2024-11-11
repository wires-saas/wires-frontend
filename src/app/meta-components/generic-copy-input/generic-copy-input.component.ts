import { Component, Input } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { Ripple } from 'primeng/ripple';
import { NgIf } from '@angular/common';
import { InputGroupModule } from 'primeng/inputgroup';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
    selector: 'app-generic-copy-input',
    templateUrl: './generic-copy-input.component.html',
    standalone: true,
    imports: [
        ButtonDirective,
        Ripple,
        NgIf,
        InputGroupModule,
        InputTextModule,
        FormsModule,
    ],
})
export class GenericCopyInputComponent {
    @Input() label: string = '';
    @Input() inputId: string = '';
    @Input() inputValue: string = '';

    buttonIcon: string = 'pi pi-copy';

    copied: boolean = false;

    async copy() {
        await navigator.clipboard.writeText(this.inputValue);
        this.copied = true;
        setTimeout(() => {
            this.copied = false;
        }, 1500);
    }
}
