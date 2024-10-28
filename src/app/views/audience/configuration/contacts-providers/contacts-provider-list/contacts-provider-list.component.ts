import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ContactsProvider } from '../../../../../services/contacts.service';

@Component({
    selector: 'app-contacts-provider-list',
    templateUrl: './contacts-provider-list.component.html',
})
export class ContactsProviderListComponent {
    @Input() loading: boolean = true;

    @Input() providers!: ContactsProvider[];

    @Input() canDeleteProvider: boolean = false;
    @Output() onDeleteProvider: EventEmitter<ContactsProvider> =
        new EventEmitter<ContactsProvider>();

    @Input() canEditProvider: boolean = false;
    @Output() onEditProvider: EventEmitter<ContactsProvider> =
        new EventEmitter<ContactsProvider>();

    @Output() onInspectProvider: EventEmitter<ContactsProvider> =
        new EventEmitter<ContactsProvider>();
}
