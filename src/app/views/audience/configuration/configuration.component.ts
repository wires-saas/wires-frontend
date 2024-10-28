import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { OrganizationService } from '../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ContactsService } from '../../../services/contacts.service';
import {
    ReadContactsProvider,
    ReadEmailsProvider,
} from '../../../utils/permission.utils';

@Component({
    templateUrl: './configuration.component.html',
})
export class AudienceConfigurationComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    currentOrgSlug!: string;

    constructor(
        private organizationService: OrganizationService,
        private contactsService: ContactsService,
    ) {}

    ngOnInit(): void {
        this.organizationService.currentOrganization$
            .pipe(
                map((organization) => {
                    if (organization) {
                        this.currentOrgSlug = organization.slug;
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    showDialog() {
        this.contactsService.showDialog($localize`Create Provider`, true);
    }

    static permissions = [ReadContactsProvider, ReadEmailsProvider];
}
