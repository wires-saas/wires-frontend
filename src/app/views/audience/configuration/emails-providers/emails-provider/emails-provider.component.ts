import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    ContactsProvider,
    ContactsService,
} from '../../../../../services/contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalizePipe } from '../../../../../utils/pipes/capitalize.pipe';
import {
    EmailsProvider,
    EmailsService,
} from '../../../../../services/emails.service';
import { Organization } from '../../../../../services/organization.service';
import { firstValueFrom } from 'rxjs';
import {
    CreateEmailsProvider,
    DeleteEmailsProvider,
    UpdateEmailsProvider,
} from '../../../../../utils/permission.utils';
import { AuthService } from '../../../../../services/auth.service';
import { Slug } from '../../../../../utils/types.utils';

@Component({
    selector: 'app-emails-provider',
    templateUrl: './emails-provider.component.html',
})
export class EmailsProviderComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

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
        private authService: AuthService,
        private router: Router,
        private route: ActivatedRoute,
        private emailsService: EmailsService,
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

    onCreateSender() {
        // ...
    }

    onEditSender(sender: any) {
        // ...
    }

    onDeleteSender(sender: any) {
        // ...
    }
}
