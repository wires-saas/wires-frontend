import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { OrganizationService } from '../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ContactsService } from '../../../services/contacts.service';

@Component({
    templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    currentOrgSlug!: string;

    constructor(private organizationService: OrganizationService,
                private contactsService: ContactsService) {}

    ngOnInit(): void {
        this.organizationService.currentOrganization$.pipe(
            map((organization) => {
                console.log(organization);
                if (organization) {
                    this.currentOrgSlug = organization.slug;
                }
            }),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe();
    }

    showDialog() {
        this.contactsService.showDialog($localize`Create Provider`, true);
    }
}
