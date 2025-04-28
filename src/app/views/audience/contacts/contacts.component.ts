import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { OrganizationService } from '../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';


// TODO bien separer la partie contacts de l'initialisation (upload/page spécifique)
// ajouter les permissions
// mocker le service front, puis mocker le service back, puis avoir des vraies données

@Component({
    templateUrl: './contacts.component.html',
})
export class ContactsComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    currentOrgSlug!: string;

    view: 'no-contact' | 'error-fetching-contacts' | 'list-contacts' = 'list-contacts';

    constructor(
        private organizationService: OrganizationService,
    ) {}

    ngOnInit(): void {
        this.organizationService.currentOrganization$
            .pipe(
                map((organization) => {
                    if (organization) {
                        this.currentOrgSlug = organization.slug;
                        this.view = 'list-contacts';
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    static permissions = [];
}
