import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalizePipe } from '../../../../../utils/pipes/capitalize.pipe';
import {
    Domain,
    EmailsProvider,
    EmailsService, Sender,
} from '../../../../../services/emails.service';
import { firstValueFrom } from 'rxjs';
import {
    CreateEmailsProvider,
    DeleteEmailsProvider,
    UpdateEmailsProvider,
} from '../../../../../utils/permission.utils';
import { AuthService } from '../../../../../services/auth.service';
import { Slug } from '../../../../../utils/types.utils';
import { SenderService } from '../../../../../services/sender.service';
import { ApiService } from '../../../../../services/api.service';
import { ConfirmationService } from 'primeng/api';
import { DomainService } from '../../../../../services/domain.service';

@Component({
    selector: 'app-emails-provider',
    templateUrl: './emails-provider.component.html',
})
export class EmailsProviderComponent implements OnInit {

    organizationSlug!: string;
    providerId!: string;

    loading: boolean = false;

    provider: EmailsProvider | undefined;
    cards: any[] = []; // TODO type

    canCreateProvider: boolean = false;
    canUpdateProvider: boolean = false;
    canDeleteProvider: boolean = false;

    get title() {
        return $localize`Emails Provider "${this.provider?.displayName}"`;
    }

    constructor(
        private apiService: ApiService,
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private emailsService: EmailsService,
        private senderService: SenderService,
        private domainService: DomainService,
        private confirmationService: ConfirmationService,
    ) {}

    async ngOnInit() {
        this.loading = true;

        this.organizationSlug = this.route.snapshot.params['slug'];
        this.providerId = this.route.snapshot.params['providerId'];

        this.provider = await this.emailsService
            .getEmailsProvider(this.organizationSlug, this.providerId)
            .catch((error) => {
                console.error(error);
                this.router.navigateByUrl('/not-found');
                return undefined;
            });

        if (this.provider) {
            this.cards = [
                {
                    icon: this.provider.isDefault
                        ? 'pi pi-star-fill'
                        : 'pi pi-star',
                    title: $localize`Favorite`,
                    description: this.provider.isDefault
                        ? $localize`Yes`
                        : $localize`No`,
                },
                {
                    icon: 'pi pi-cog',
                    title: $localize`Type`,
                    description: new CapitalizePipe().transform(
                        this.provider.type,
                    ),
                },
                {
                    icon: 'pi pi-globe',
                    title: $localize`Domains`,
                    description: this.provider.domains.length,
                },
                {
                    icon: 'pi pi-at',
                    title: $localize`Addresses`,
                    description: this.provider.senders.length,
                },
            ];

            await this.loadPermissions(this.organizationSlug);
        }

        this.loading = false;
    }

    private async loadPermissions(organizationSlug: Slug) {
        this.canCreateProvider = await firstValueFrom(
            this.authService.hasPermission$(
                CreateEmailsProvider,
                organizationSlug,
            ),
        );

        this.canUpdateProvider = await firstValueFrom(
            this.authService.hasPermission$(
                UpdateEmailsProvider,
                organizationSlug,
            ),
        );

        this.canDeleteProvider = await firstValueFrom(
            this.authService.hasPermission$(
                DeleteEmailsProvider,
                organizationSlug,
            ),
        );

        // TODO distinct permissions for senders and domains ?
    }

    openCreateSender() {
        this.senderService.showDialog($localize`Create Sender`, true);
    }

    openEditSender(sender: any) {
        this.senderService.selectSender(sender);
        this.senderService.showDialog($localize`Edit Sender`, false);
    }

    openDeleteSender(sender: any) {

        this.senderService.closeDialog();

        this.confirmationService.confirm({
            header: $localize `Delete Sender "${sender.email}"`,
            key: 'confirm-delete-sender',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.apiService.wrap(
                    this.senderService
                        .removeSender(this.organizationSlug, this.providerId, sender),
                    $localize`Sender "${sender.email}" deleted successfully.`,
                    $localize`Error deleting sender`,
                );
            },
        });
    }

    async onCreateSender(sender: Sender) {

        await this.apiService.wrap(
            this.senderService
                .createSender(this.organizationSlug, this.providerId, sender),
            $localize`Sender "${sender.email}" created successfully.`,
            $localize`Error creating sender`,
        );

        this.senderService.closeDialog();
    }

    async onEditSender(sender: Sender) {
        await this.apiService.wrap(
            this.senderService
                .updateSenders(this.organizationSlug, this.providerId, [sender]),
            $localize`Sender "${sender.email}" updated successfully.`,
            $localize`Error updating sender`,
        );

        this.senderService.closeDialog();
    }



    // For domains

    openCreateDomain() {
        this.domainService.showDialog($localize`Create Domain`, true);
    }

    openInspectDomain(domain: Domain) {
        this.domainService.selectDomain(domain);
        this.domainService.showDialog($localize`Domain ${domain}`, false);
    }

    openDeleteDomain(domain: Domain) {

        this.domainService.closeDialog();

        this.confirmationService.confirm({
            header: $localize `Delete Domain "${domain.domain}"`,
            key: 'confirm-delete-domain',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.apiService.wrap(
                    this.domainService
                        .removeDomain(this.organizationSlug, this.providerId, domain),
                    $localize`Domain "${domain}" deleted successfully.`,
                    $localize`Error deleting domain`,
                );
            },
        });
    }
}
