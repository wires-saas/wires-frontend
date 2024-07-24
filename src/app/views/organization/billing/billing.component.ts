import { Component } from '@angular/core';
import { Organization, OrganizationService } from '../../../services/organization.service';

@Component({
    templateUrl: './billing.component.html'
})
export class BillingComponent {

    currentOrganization: Organization | undefined;

    constructor(private organizationService: OrganizationService) {
        this.organizationService.currentOrganization$.subscribe(org => this.currentOrganization = org);
    }
}
