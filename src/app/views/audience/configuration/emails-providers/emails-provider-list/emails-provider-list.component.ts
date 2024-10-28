import {
    Component,
    EventEmitter,
    Input,
    Output,
} from '@angular/core';
import { EmailsProvider } from '../../../../../services/emails.service';

@Component({
    selector: 'app-emails-provider-list',
    templateUrl: './emails-provider-list.component.html',
})
export class EmailsProviderListComponent {

    @Input() loading: boolean = true;

    @Input() providers!: EmailsProvider[];

    @Input() canDeleteProvider: boolean = false;
    @Output() onDeleteProvider: EventEmitter<EmailsProvider> = new EventEmitter<EmailsProvider>();

    @Input() canEditProvider: boolean = false;
    @Output() onEditProvider: EventEmitter<EmailsProvider> = new EventEmitter<EmailsProvider>();

    @Output() onInspectProvider: EventEmitter<EmailsProvider> = new EventEmitter<EmailsProvider>();

}
