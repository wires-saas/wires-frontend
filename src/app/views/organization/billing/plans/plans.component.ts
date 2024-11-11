import {Component, DestroyRef, EventEmitter, inject, OnInit, Output} from '@angular/core';
import { map } from 'rxjs/operators';
import {
    Organization,
    OrganizationService,
    Plan, PlanType,
} from '../../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { firstValueFrom } from 'rxjs';
import {
    DeleteBilling,
    UpdateBilling,
} from '../../../../utils/permission.utils';
import { AuthService } from '../../../../services/auth.service';
import {environment} from "../../../../../environments/environment";

@Component({
    selector: 'app-information-plans',
    templateUrl: './plans.component.html',
})
export class PlansComponent implements OnInit {
    plan: Plan | undefined;

    canUpdatePlan: boolean = false;
    canCancelPlan: boolean = false;

    currentOrgSlug: string | undefined;

    private destroyRef = inject(DestroyRef);

    @Output() onPlanSelection: EventEmitter<Exclude<PlanType, PlanType.FREE>> = new EventEmitter<Exclude<PlanType, PlanType.FREE>>();
    @Output() onPlanUpgrade: EventEmitter<Exclude<PlanType, PlanType.FREE>> = new EventEmitter<Exclude<PlanType, PlanType.FREE>>();
    @Output() onPlanDowngrade: EventEmitter<Exclude<PlanType, PlanType.FREE>> = new EventEmitter<Exclude<PlanType, PlanType.FREE>>();
    @Output() onPlanCancel: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        private authService: AuthService,
        private organizationService: OrganizationService,
    ) {}

    ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map(async (organization: Organization | undefined) => {
                    this.currentOrgSlug = organization?.slug;

                    this.canUpdatePlan = await firstValueFrom(
                        this.authService.hasPermission$(UpdateBilling),
                    );
                    this.canCancelPlan = await firstValueFrom(
                        this.authService.hasPermission$(DeleteBilling),
                    );

                    if (organization) {
                        this.plan = await this.organizationService.getPlan(
                            organization.slug,
                        );
                        console.log(this.plan);
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }
}
