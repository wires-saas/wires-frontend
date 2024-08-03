import { Component } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Message, MessageService } from 'primeng/api';
import { AuthService } from '../../../services/auth.service';

@Component({
    templateUrl: './request-password-reset.component.html',
    providers: [MessageService]
})
export class RequestPasswordResetComponent {

    msgs: Message[] = [];

    pending: boolean = false;

    email: string = '';

    constructor(private layoutService: LayoutService, private service: MessageService, private authService: AuthService) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    showResetMailSentMessage() {
        if (this.msgs.length === 0) this.msgs = [{ severity: 'info', summary: 'An email has been sent to you !', detail: '' }];
    }

    async submitPasswordResetRequest() {

        if (!this.email) return;

        this.msgs = [];
        this.pending = true;

        await this.authService.requestPasswordReset(this.email);

        this.pending = false;
        this.showResetMailSentMessage();
    }
}
