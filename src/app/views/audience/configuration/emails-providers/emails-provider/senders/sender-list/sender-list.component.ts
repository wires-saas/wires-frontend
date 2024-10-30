import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Sender } from '../../../../../../../services/sender.service';

@Component({
    selector: 'app-sender-list',
    templateUrl: './sender-list.component.html',
})
export class SenderListComponent {
    @Input() loading: boolean = true;

    @Input() senders!: Sender[];

    @Input() canEditSender: boolean = false;
    @Output() onEditSender: EventEmitter<Sender> = new EventEmitter<Sender>();

    columns: string[] = [$localize`Email`, $localize`Name`, $localize`Status`];
}
