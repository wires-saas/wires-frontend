import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalizePipe } from '../../../../../utils/pipes/capitalize.pipe';
import {
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
import { SendersService } from '../../../../../services/senders.service';
import { ApiService } from '../../../../../services/api.service';
import { ConfirmationService } from 'primeng/api';

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
        private sendersService: SendersService,
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
                    description: 3,
                },
                {
                    icon: 'pi pi-at',
                    title: $localize`Addresses`,
                    description: 2,
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
        this.sendersService.showDialog($localize`Create Sender`, true);
    }

    openEditSender(sender: any) {
        this.sendersService.selectSender(sender);
        this.sendersService.showDialog($localize`Edit Sender`, false);
    }

    openDeleteSender(sender: any) {
        if (!this.canUpdateProvider) return;

        this.sendersService.closeDialog();

        this.confirmationService.confirm({
            header: $localize `Delete Sender "${sender.email}"`,
            key: 'confirm-delete-sender',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.apiService.wrap(
                    this.sendersService
                        .removeSender(this.organizationSlug, this.providerId, sender),
                    $localize`Sender "${sender.email}" deleted successfully.`,
                    $localize`Error deleting sender`,
                );
            },
        });
    }

    async onCreateSender(sender: Sender) {

        await this.apiService.wrap(
            this.sendersService
                .createSender(this.organizationSlug, this.providerId, sender),
            $localize`Sender "${sender.email}" created successfully.`,
            $localize`Error creating sender`,
        );

        this.sendersService.closeDialog();
    }

    async onEditSender(sender: Sender) {
        await this.apiService.wrap(
            this.sendersService
                .updateSenders(this.organizationSlug, this.providerId, [sender]),
            $localize`Sender "${sender.email}" updated successfully.`,
            $localize`Error updating sender`,
        );

        this.sendersService.closeDialog();
    }
}
