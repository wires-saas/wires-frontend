import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    Organization,
    OrganizationService,
} from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { PlanPricePipe } from '../../../utils/plans/plan-price.pipe';
import { ReadBilling } from '../../../utils/permission.utils';

@Component({
    templateUrl: './billing.component.html',
})
export class BillingComponent implements OnInit {
    currentOrganization: Organization | undefined;

    today = new Date();

    lastDayOfPreviousMonth: number | undefined;
    dueDate: number | undefined;

    amount: number = 0;
    taxes: number = 0;
    totalAmount: number = 0;
    reference: string = '';

    private destroyRef = inject(DestroyRef);

    constructor(private organizationService: OrganizationService) {}

    ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map((org) => {
                    this.currentOrganization = org;
                    if (org) this.initializeBill(org);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        const date = new Date();
        date.setDate(0);
        this.lastDayOfPreviousMonth = date.getTime();

        date.setDate(date.getDate() + 30);
        this.dueDate = date.getTime();
    }

    private initializeBill(organization: Organization) {
        this.amount = this.getPlanPrice(organization);
        this.taxes = this.getTaxes(organization);
        this.totalAmount = this.amount + this.taxes;

        const paddedMonth = this.today.getMonth().toString().padStart(2, '0');
        const paddedYear = this.today.getFullYear().toString().slice(-2);
        this.reference = `${organization.slug}${paddedYear}${paddedMonth}`;
    }

    private getPlanPrice(organization: Organization): number {
        const planPricePipe = new PlanPricePipe();
        const planPrice = planPricePipe.transform(
            organization.subscription.type,
        );
        return typeof planPrice === 'number' ? planPrice : 0;
    }

    private getTaxes(organization: Organization): number {
        const planPricePipe = new PlanPricePipe();
        const planPrice = planPricePipe.transform(
            organization.subscription.type,
        );
        if (typeof planPrice === 'number') {
            return planPrice * 0.2;
        } else {
            return 0;
        }
    }

    static permissions = [ReadBilling];
}
