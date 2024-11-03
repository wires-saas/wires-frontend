import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalizePipe } from '../../../../../utils/pipes/capitalize.pipe';
import { EmailsProvider, EmailsService, } from '../../../../../services/emails.service';
import { firstValueFrom } from 'rxjs';
import {
    CreateEmailsProvider,
    DeleteEmailsProvider,
    UpdateEmailsProvider,
} from '../../../../../utils/permission.utils';
import { AuthService } from '../../../../../services/auth.service';
import { Slug } from '../../../../../utils/types.utils';
import { Sender, SenderService } from '../../../../../services/sender.service';
import { ApiService } from '../../../../../services/api.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CreateDomainDto, Domain, DomainService, DomainStatus } from '../../../../../services/domain.service';

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
        private messageService: MessageService,
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
    }

    openCreateSender() {
        this.senderService.showDialog($localize`Create Sender`, true);
    }

    openEditSender(sender: any) {
        this.senderService.selectSender(sender);
        this.senderService.showDialog($localize`Edit Sender`, false);
    }

    async openDeleteSender(sender: Sender) {

        const otherSenders = this.provider?.senders || [];
        const selectedSender = await firstValueFrom(this.senderService.selectedSender$);

        const sendersWithDelete = otherSenders.filter((s) => s.email !== selectedSender?.email);

        this.senderService.closeDialog();

        this.confirmationService.confirm({
            header: $localize `Delete Sender "${sender.email}"`,
            key: 'confirm-delete-sender',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.apiService.wrap(
                    this.senderService
                        .updateSenders(this.organizationSlug, this.providerId, sendersWithDelete),
                    $localize`Sender "${sender.email}" deleted successfully.`,
                    $localize`Error deleting sender`,
                );

                await this.ngOnInit();
            },
        });
    }

    async onCreateSender(sender: Sender) {

        const otherSenders = this.provider?.senders || [];

        const senders = [
            ...otherSenders,
            sender
        ];

        await this.apiService.wrap(
            this.senderService
                .updateSenders(this.organizationSlug, this.providerId, senders),
            $localize`Sender "${sender.email}" created successfully.`,
            $localize`Error creating sender`,
        );

        this.senderService.closeDialog();

        await this.ngOnInit();
    }

    async onEditSender(sender: Sender) {

        const otherSenders = this.provider?.senders || [];
        const selectedSender = await firstValueFrom(this.senderService.selectedSender$);

        const sendersWithUpdate = otherSenders.map((s) => {
            if (s.email === selectedSender?.email) {
                return sender;
            }
            return s;
        });

        await this.apiService.wrap(
            this.senderService
                .updateSenders(this.organizationSlug, this.providerId, sendersWithUpdate),
            $localize`Sender "${sender.email}" updated successfully.`,
            $localize`Error updating sender`,
        );

        this.senderService.closeDialog();

        await this.ngOnInit();
    }



    // For domains

    openCreateDomain() {
        this.domainService.showCreateDialog();
    }

    async onCreateDomain(domain: CreateDomainDto) {

        await this.apiService.wrap(
            this.domainService
                .createDomain(this.organizationSlug, this.providerId, domain.domain),
            $localize`Domain "${domain.domain}" added successfully.`,
            $localize`Error adding domain`,
        );

        this.domainService.closeCreateDialog();

        await this.ngOnInit();
    }

    openInspectDomain(domain: Domain) {
        this.domainService.selectDomain(domain);
        this.domainService.showInspectDialog();
    }

    async onVerifyDomain(domain: Domain) {

        const domainPostVerification = await this.domainService
            .checkDomain(this.organizationSlug, this.providerId, domain);

        if (!domain.ownership) {
            if (domainPostVerification.ownership) {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Ownership`,
                    detail: $localize`Ownership verified successfully.`,
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: $localize`Ownership`,
                    detail: $localize`Ownership verification failed.`,
                });
            }
        }

        if (!domain.dkim) {
            if (domainPostVerification.dkim) {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`DKIM`,
                    detail: $localize`DKIM verified successfully.`,
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: $localize`DKIM`,
                    detail: $localize`DKIM verification failed.`,
                });
            }
        }

        if (!domain.spf) {
            if (domainPostVerification.spf) {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`SPF`,
                    detail: $localize`SPF verified successfully.`,
                });
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: $localize`SPF`,
                    detail: $localize`SPF verification failed.`,
                });
            }
        }

        if (domainPostVerification.status === DomainStatus.Verified) {
            this.messageService.add({
                severity: 'success',
                summary: $localize`Domain`,
                detail: $localize`Domain verified successfully.`,
            });

            this.domainService.closeInspectDialog();

            await this.ngOnInit();
        }
    }

    openDeleteDomain(domain: Domain) {

        this.domainService.closeInspectDialog();

        this.confirmationService.confirm({
            header: $localize `Delete Domain "${domain.domain}"`,
            key: 'confirm-delete-domain',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.apiService.wrap(
                    this.domainService
                        .removeDomain(this.organizationSlug, this.providerId, domain),
                    $localize`Domain "${domain.domain}" deleted successfully.`,
                    $localize`Error deleting domain`,
                );

                await this.ngOnInit();
            },
        });
    }
}
