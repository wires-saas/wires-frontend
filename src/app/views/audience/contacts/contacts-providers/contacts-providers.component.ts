import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ContactsProvider, ContactsService } from '../../../../services/contacts.service';
import { Organization, OrganizationService } from '../../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageUtils } from '../../../../utils/message.utils';
import { firstValueFrom } from 'rxjs';
import {
    CreateContactsProvider,
    DeleteContactsProvider,
    UpdateContactsProvider
} from '../../../../utils/permission.utils';

@Component({
    selector: 'app-contacts-providers',
    templateUrl: './contacts-providers.component.html',
})
export class ContactsProviderComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    loadingProviders: boolean = false;

    providers: ContactsProvider[] = [];


    canCreateProvider: boolean = false;
    canUpdateProvider: boolean = false;
    canDeleteProvider: boolean = false;

    currentOrgSlug!: string;

    constructor(
        private authService: AuthService,
        private contactsService: ContactsService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private organizationService: OrganizationService,
    ) {}

    ngOnInit() {
        this.organizationService.currentOrganization$.pipe(
            map(async(organization) => {
                if (organization) {
                    this.currentOrgSlug = organization.slug;
                    this.providers = await this.contactsService.getContactsProviders(organization.slug);
                    console.log(this.providers);
                    await this.loadPermissions(organization);

                } else {
                    this.providers = [];
                    this.canDeleteProvider = false;
                }
            }),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe();
    }

    private async loadPermissions(organization: Organization) {

        this.canCreateProvider = await firstValueFrom(
            this.authService.hasPermission$(CreateContactsProvider, organization.slug)
        );

        this.canUpdateProvider = await firstValueFrom(
            this.authService.hasPermission$(UpdateContactsProvider, organization.slug)
        );

        this.canDeleteProvider = await firstValueFrom(
            this.authService.hasPermission$(DeleteContactsProvider, organization.slug)
        );

        // TODO: Implement the following methods
        this.canCreateProvider = true;
        this.canUpdateProvider = true;
        this.canDeleteProvider = true;
    }

    onDeleteProvider(provider: ContactsProvider) {
        if (!this.canDeleteProvider) return;

        this.confirmationService.confirm({
            key: 'confirm-delete-feed',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.contactsService
                    .removeContactsProvider(
                        provider.organization,
                        provider._id,
                    )
                    .then(() => {
                        this.messageService.add({
                            severity: 'success',
                            summary: $localize`Success`,
                            detail: $localize`Provider has been deleted successfully.`,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        MessageUtils.parseServerError(
                            this.messageService,
                            err,
                            {
                                summary: $localize`Error deleting provider`,
                            },
                        );
                    });
            },
        });
    }

    onEditProvider(provider: ContactsProvider) {
        this.contactsService.selectContactsProvider(provider);
        this.contactsService.showDialog($localize`Edit Provider`, false);
    }

    showDialog() {
        this.contactsService.showDialog($localize`Create Provider`, true);
    }

}
