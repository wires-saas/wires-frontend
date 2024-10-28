import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ContactsProvider, ContactsService } from '../../../../../services/contacts.service';
import { ActivatedRoute, Router } from '@angular/router';
import { CapitalizePipe } from '../../../../../utils/pipes/capitalize.pipe';
import { EmailsProvider, EmailsService } from '../../../../../services/emails.service';

@Component({
    selector: 'app-emails-provider',
    templateUrl: './emails-provider.component.html',
})
export class EmailsProviderComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    organizationSlug!: string;
    providerId!: string;

    provider: EmailsProvider | undefined;
    cards: any[] = []; // TODO type

    get title() {
        return $localize`Emails Provider "${this.provider?.displayName}"`;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private emailsService: EmailsService,
    ) {}

    async ngOnInit() {
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
                    icon: this.provider.isDefault ? 'pi pi-star-fill' : 'pi pi-star',
                    title: $localize `Favorite`,
                    description: this.provider.isDefault ? $localize `Yes` : $localize `No`
                },
                {
                    icon: 'pi pi-cog',
                    title: $localize `Type`,
                    description: new CapitalizePipe().transform(this.provider.type)
                },
                {
                    icon: 'pi pi-list',
                    title: $localize `Contacts Lists`,
                    description: 3
                }, {
                    icon: 'pi pi-users',
                    title: $localize `Distinct Contacts`,
                    description: 283
                }
            ];
        }
    }
}
