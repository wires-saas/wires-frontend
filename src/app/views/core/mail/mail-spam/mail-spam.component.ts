import { Component, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';
import { Mail, MailService } from '../service/mail.service';

@Component({
    selector: 'app-mail-spam',
    templateUrl: './mail-spam.component.html',
})
export class MailSpamComponent implements OnDestroy {
    spamMails: Mail[] = [];

    subscription: Subscription;

    constructor(private mailService: MailService) {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.spamMails = data.filter(
                (d) =>
                    d.spam &&
                    !d.archived &&
                    !d.trash &&
                    !d.hasOwnProperty('sent')
            );
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
