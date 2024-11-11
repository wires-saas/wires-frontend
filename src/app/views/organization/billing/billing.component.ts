import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    Organization,
    OrganizationService,
} from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReadBilling } from '../../../utils/permission.utils';
import {environment} from "../../../../environments/environment";

@Component({
    templateUrl: './billing.component.html',
})
export class BillingComponent implements OnInit {
    currentOrganization: Organization | undefined;

    private destroyRef = inject(DestroyRef);

    constructor(private organizationService: OrganizationService) {}

    ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map((org) => {
                    this.currentOrganization = org;
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }


    getBillingPortalLink() {
        if (this.currentOrganization && this.currentOrganization.billingContact.email) {
            return `${environment.billingPortal}?prefilled_email=${this.currentOrganization.billingContact.email}`;
        } else {
            return environment.billingPortal;
        }
    }

    static permissions = [ReadBilling];
}
