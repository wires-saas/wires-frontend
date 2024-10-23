import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ContactsProvider, ContactsService } from '../../../../../services/contacts.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    selector: 'app-contacts-provider',
    templateUrl: './contacts-provider.component.html',
})
export class ContactsProviderComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    organizationSlug!: string;
    providerId!: string;

    provider: ContactsProvider | undefined;

    get title() {
        return $localize`Contacts Provider "${this.provider?.displayName}"`;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private contactsService: ContactsService,
    ) {}

    async ngOnInit() {
        this.organizationSlug = this.route.snapshot.params['slug'];
        this.providerId = this.route.snapshot.params['providerId'];

        this.provider = await this.contactsService
            .getContactsProvider(this.organizationSlug, this.providerId)
            .catch((error) => {
                console.error(error);
                this.router.navigateByUrl('/not-found');
                return undefined;
            });
    }


}
