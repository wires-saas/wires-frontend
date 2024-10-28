import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Organization, OrganizationService } from '../../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { AuthService } from '../../../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageUtils } from '../../../../utils/message.utils';
import { firstValueFrom } from 'rxjs';
import {
    CreateEmailsProvider, DeleteEmailsProvider, ReadEmailsProvider, UpdateEmailsProvider
} from '../../../../utils/permission.utils';
import { Router } from '@angular/router';
import { EmailsProvider, EmailsService } from '../../../../services/emails.service';

@Component({
    selector: 'app-emails-providers',
    templateUrl: './emails-providers.component.html',
})
export class EmailsProvidersComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    loadingProviders: boolean = false;

    providers: EmailsProvider[] = [];


    canCreateProvider: boolean = false;
    canUpdateProvider: boolean = false;
    canDeleteProvider: boolean = false;

    currentOrgSlug!: string;

    constructor(
        private authService: AuthService,
        private emailsService: EmailsService,
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
                    this.providers = await this.emailsService.getEmailsProviders(organization.slug);
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
            this.authService.hasPermission$(CreateEmailsProvider, organization.slug)
        );

        this.canUpdateProvider = await firstValueFrom(
            this.authService.hasPermission$(UpdateEmailsProvider, organization.slug)
        );

        this.canDeleteProvider = await firstValueFrom(
            this.authService.hasPermission$(DeleteEmailsProvider, organization.slug)
        );
    }

    onDeleteProvider(provider: EmailsProvider) {
        if (!this.canDeleteProvider) return;

        this.confirmationService.confirm({
            key: 'confirm-delete-emails-provider',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.emailsService
                    .removeEmailsProvider(
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

    async onInspectProvider(provider: EmailsProvider) {
        await this.router.navigate([`/organization/${provider.organization}/audience/configuration/emails-providers/${provider.id}`]);
    }

    onEditProvider(provider: EmailsProvider) {
        this.emailsService.selectEmailsProvider(provider);
        this.emailsService.showDialog($localize`Edit Provider`, false);
    }

    showDialog() {
        this.emailsService.showDialog($localize`Create Provider`, true);
    }

    static permissions = [ReadEmailsProvider];

}
