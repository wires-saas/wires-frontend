import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { OrganizationService } from 'src/app/services/organization.service';
@Component({
    selector: 'app-no-contact',
    templateUrl: './no-contact.component.html',
})
export class NoContactComponent {
    constructor(private router: Router, private organizationService: OrganizationService) {}

    async navigateToUpload() {
        const org = await firstValueFrom(this.organizationService.currentOrganization$);
        if (org?.slug) {
            this.router.navigate(['/organization/' + org.slug + '/audience/contacts/upload']);
        }
    }
} 