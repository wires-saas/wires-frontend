import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Message, MessageService } from 'primeng/api';

@Component({
    templateUrl: './request-password-reset.component.html',
    providers: [MessageService]
})
export class RequestPasswordResetComponent {

    msgs: Message[] = [];

    pending: boolean = false;

    constructor(private layoutService: LayoutService, private service: MessageService) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    showResetMailSentMessage() {
        if (this.msgs.length === 0) this.msgs = [{ severity: 'info', summary: 'An email has been sent to you !', detail: '' }];
    }

    submitPasswordResetRequest() {
        this.msgs = [];
        this.pending = true;

        // TODO API CALL

        setTimeout(() => {
            this.pending = false;
            this.showResetMailSentMessage();
        }, 1000);
    }
}
