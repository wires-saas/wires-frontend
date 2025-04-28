import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { OrganizationService } from 'src/app/services/organization.service';
@Component({
    selector: 'app-error-fetching-contacts',
    templateUrl: './error-fetching-contacts.component.html',
})
export class ErrorFetchingContactsComponent {
    constructor(
        private router: Router,
        private organizationService: OrganizationService,
    ) {}

    async navigateToProviders() {
        const lastOrg = await firstValueFrom(
            this.organizationService.currentOrganization$,
        );

        if (lastOrg) {
            this.router.navigate([
                '/organization',
                lastOrg.slug,
                'audience',
                'configuration'
            ]);
        }
    }
} 