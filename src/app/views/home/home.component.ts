import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../services/organization.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import {AuthService} from "../../services/auth.service";

// Component to handle arrival on /
// Dispatching to first organization, auth page or landing page

@Component({
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {
    constructor(
        private authService: AuthService,
        private router: Router,
        private organizationService: OrganizationService,
    ) {}

    async ngOnInit() {
        // try to redirect to the last known organization
        const lastOrg = await firstValueFrom(
            this.organizationService.currentOrganization$,
        );

        if (lastOrg) {
            console.debug(
                `Redirecting to default organization page: /organization/${lastOrg.slug}/files`,
            );
            await this.router.navigate([
                '/organization',
                lastOrg.slug,
                'files',
            ]);
            return;
        }

        // else fetching all organizations and redirecting to the first one
        await this.organizationService.getAll()
            .then(async (orgs) => {
                if (orgs.length > 0) {
                    await this.router.navigate([
                        '/organization',
                        orgs[0].slug,
                        'files',
                    ]);
                } else {
                    await this.authService.logOut();
                    await this.router.navigate(['/auth/no-organization']);
                }
            })
            .catch(async (err) => {
                console.error('Failed to fetch organizations', err);

                const hasKnownAccessToken = await this.authService.hasKnownAccessToken();

                if (hasKnownAccessToken) {
                    await this.authService.logOut();
                    await this.router.navigate(['/auth']);
                    return [];
                } else {
                    await this.router.navigate(['/landing']);
                    return [];
                }

            });
    }
}
