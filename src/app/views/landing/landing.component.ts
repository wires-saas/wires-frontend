import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { PlanType } from '../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { environment } from '../../../environments/environment';

@Component({
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
})
export class LandingComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    darkMode: boolean = false;

    planPostCheckout: PlanType | undefined;

    get documentationLink() {
        return environment.documentation;
    }

    constructor(
        public router: Router,
        private layoutService: LayoutService,
        private route: ActivatedRoute,
    ) {}

    ngOnInit() {
        if (this.route.snapshot.queryParams['plan']) {
            this.planPostCheckout = this.route.snapshot.queryParams[
                'plan'
            ] as PlanType;
        } else {
            this.planPostCheckout = undefined;
        }

        this.layoutService.configUpdate$
            .pipe(
                map((config) => {
                    this.darkMode =
                        config.colorScheme === 'dark' ||
                        config.colorScheme === 'dim';
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    openPaymentLink(plan: Exclude<PlanType, PlanType.FREE>) {
        const paymentLink =
            environment.paymentLinks && environment.paymentLinks.guest[plan];

        if (paymentLink) window.open(paymentLink, '_blank');
        else console.error('No payment link for plan', plan);

        console.debug(paymentLink);
    }
}
