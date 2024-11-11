import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-payment-confirmation-dialog',
    templateUrl: './payment-confirmation-dialog.component.html',
})
export class PaymentConfirmationDialogComponent {
    @Input() visible: boolean = false;
}
