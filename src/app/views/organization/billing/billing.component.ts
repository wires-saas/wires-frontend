import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    Organization,
    OrganizationService, Plan, PlanStatus, PlanType,
} from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ReadBilling } from '../../../utils/permission.utils';
import { environment } from '../../../../environments/environment';

@Component({
    templateUrl: './billing.component.html',
})
export class BillingComponent implements OnInit {
    currentOrganization: Organization | undefined;
    currentOrganizationPlan: Plan | undefined;

    private destroyRef = inject(DestroyRef);

    constructor(private organizationService: OrganizationService) {}

    ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map(async (org) => {
                    this.currentOrganization = org;
                    if (org) {
                        this.currentOrganizationPlan = await this.organizationService.getPlan(org.slug);
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    getBillingPortalLink() {
        if (this.currentOrganizationPlan?.customerEmail) {
            return `${environment.billingPortal}?prefilled_email=${this.currentOrganizationPlan?.customerEmail}`;
        } else {
            return environment.billingPortal;
        }
    }

    openPortal() {
        window.open(this.getBillingPortalLink(), '_blank');
    }

    openPaymentLink(plan: Exclude<PlanType, PlanType.FREE>) {
        const paymentLink =
            environment.paymentLinks && environment.paymentLinks.user[plan];

        if (paymentLink) window.open(paymentLink, '_blank');
        else console.error('No payment link for plan', plan);

        console.debug(paymentLink);
    }

    static permissions = [ReadBilling];
    protected readonly PlanStatus = PlanStatus;
}
