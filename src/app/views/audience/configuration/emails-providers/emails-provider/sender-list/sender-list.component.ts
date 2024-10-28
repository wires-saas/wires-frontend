import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sender } from '../../../../../../services/emails.service';

@Component({
    selector: 'app-sender-list',
    templateUrl: './sender-list.component.html',
})
export class SenderListComponent {
    @Input() loading: boolean = true;

    @Input() senders!: Sender[];

    @Input() canDeleteSender: boolean = false;
    @Output() onDeleteSender: EventEmitter<Sender> = new EventEmitter<Sender>();

    @Input() canEditSender: boolean = false;
    @Output() onEditSender: EventEmitter<Sender> = new EventEmitter<Sender>();

    @Output() onCreateSender: EventEmitter<void> = new EventEmitter<void>();

    columns: string[] = [$localize`Email`, $localize`Name`, $localize`Status`];
}
