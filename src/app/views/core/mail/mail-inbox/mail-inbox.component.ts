import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';
import { Mail, MailService } from '../service/mail.service';

@Component({
    selector: 'app-mail-inbox',
    templateUrl: './mail-inbox.component.html',
})
export class MailInboxComponent implements OnDestroy {
    mails: Mail[] = [];

    subscription: Subscription;

    constructor(private mailService: MailService, private router: Router) {
        this.subscription = this.mailService.mails$.subscribe((data) => {
            this.mails = data.filter(
                (d) =>
                    !d.archived &&
                    !d.spam &&
                    !d.trash &&
                    !d.hasOwnProperty('sent')
            );
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }
}
