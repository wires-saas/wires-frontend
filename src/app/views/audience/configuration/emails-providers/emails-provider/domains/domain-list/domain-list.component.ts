import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Domain } from '../../../../../../../services/emails.service';

@Component({
    selector: 'app-domain-list',
    templateUrl: './domain-list.component.html',
})
export class DomainListComponent {
    @Input() loading: boolean = true;

    @Input() domains!: Domain[];

    @Input() canDeleteDomain: boolean = false;
    @Output() onDeleteDomain: EventEmitter<Domain> = new EventEmitter<Domain>();

    @Input() canInspectDomain: boolean = false;
    @Output() onInspectDomain: EventEmitter<Domain> = new EventEmitter<Domain>();

    columns: string[] = [
        $localize`Domain`,
        $localize`Ownership`,
        $localize`DKIM`,
        $localize`SPF`,
        $localize`Status`
    ];
}
