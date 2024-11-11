import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Subscription } from 'rxjs';
import { PlanType } from '../../services/organization.service';
import {environment} from "../../../environments/environment";

@Component({
    templateUrl: './plans.component.html',
    selector: 'app-plans',
})
export class PlansComponent implements OnDestroy {
    subscription: Subscription;

    darkMode: boolean = false;

    @Input() canCancelPlan: boolean = true;
    @Input() canUpdatePlan: boolean = false;

    @Input() planEnabled: PlanType | undefined;
    @Input() forLanding: boolean = false;

    constructor(
        public router: Router,
        private layoutService: LayoutService,
    ) {
        this.subscription = this.layoutService.configUpdate$.subscribe(
            (config) => {
                this.darkMode =
                    config.colorScheme === 'dark' ||
                    config.colorScheme === 'dim';
            },
        );
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    cancelPlan() {
        // TODO
    }

    selectPlan(plan: Exclude<PlanType, PlanType.FREE>) {
        const paymentLink = environment.paymentLinks && environment.paymentLinks[plan];
        if (paymentLink) window.open(paymentLink, '_blank');
        else console.error('No payment link for plan', plan);

        this.planEnabled = plan;
    }

    protected readonly PlanType = PlanType;
}
