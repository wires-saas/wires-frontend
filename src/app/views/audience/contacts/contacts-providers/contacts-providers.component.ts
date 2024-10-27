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
import { Router } from '@angular/router';

@Component({
    selector: 'app-contacts-providers',
    templateUrl: './contacts-providers.component.html',
})
export class ContactsProvidersComponent implements OnInit {
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
        private router: Router,
    ) {}

    ngOnInit() {
        this.organizationService.currentOrganization$.pipe(
            map(async(organization) => {
                if (organization) {
                    this.loadingProviders = true;
                    await this.loadPermissions(organization);
                    this.currentOrgSlug = organization.slug;
                    this.providers = await this.contactsService.getContactsProviders(organization.slug);
                    this.loadingProviders = false;
                } else {
                    this.providers = [];
                    this.canCreateProvider = false;
                    this.canUpdateProvider = false;
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
            key: 'confirm-delete-provider',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.contactsService
                    .removeContactsProvider(
                        provider.organization,
                        provider.id,
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

    async onInspectProvider(provider: ContactsProvider) {
        await this.router.navigate([`/organization/${provider.organization}/audience/contacts/providers/${provider.id}`]);
    }

    onEditProvider(provider: ContactsProvider) {
        this.contactsService.selectContactsProvider(provider);
        this.contactsService.showDialog($localize`Edit Provider`, false);
    }

    showDialog() {
        this.contactsService.showDialog($localize`Create Provider`, true);
    }

}
