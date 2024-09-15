import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../services/organization.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
    templateUrl: './home.component.html',
})
export class HomeComponent implements OnInit {

    constructor(private router: Router, private organizationService: OrganizationService) {
    }

    async ngOnInit() {

        // try to redirect to the last known organization
        const lastOrg = await firstValueFrom(this.organizationService.currentOrganization$);
        if (lastOrg) {
            console.debug(`Redirecting to default organization page: /organization/${lastOrg.slug}/files`);
            await this.router.navigate(['/organization', lastOrg.slug, 'files']);
            return;
        }

        // else fetching all organizations and redirecting to the first one
        const organizations = await this.organizationService.getAll();

        if (organizations.length > 0) {
            await this.router.navigate(['/organization', organizations[0].slug, 'files']);
        }

        // TODO else throw message that no organization is available

    }

}
