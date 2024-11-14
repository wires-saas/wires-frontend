import {Component, DestroyRef, EventEmitter, inject, Input, OnDestroy, OnInit, Output} from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Subscription } from 'rxjs';
import {Organization, OrganizationService, Plan, PlanType} from '../../services/organization.service';
import { environment } from '../../../environments/environment';
import {map} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Component({
    templateUrl: './plans.component.html',
    selector: 'app-plans',
})
export class PlansComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    currentOrganization: Organization | undefined;

    darkMode: boolean = false;

    @Input() canCancelPlan: boolean = false;
    @Input() canUpdatePlan: boolean = false;

    @Input() planEnabled: PlanType | undefined;
    @Input() forLanding: boolean = false;

    @Output() onPlanSelection: EventEmitter<Exclude<PlanType, PlanType.FREE>> = new EventEmitter<Exclude<PlanType, PlanType.FREE>>();
    @Output() onPlanUpgrade: EventEmitter<Exclude<PlanType, PlanType.FREE>> = new EventEmitter<Exclude<PlanType, PlanType.FREE>>();
    @Output() onPlanDowngrade: EventEmitter<Exclude<PlanType, PlanType.FREE>> = new EventEmitter<Exclude<PlanType, PlanType.FREE>>();
    @Output() onPlanCancel: EventEmitter<void> = new EventEmitter<void>();

    constructor(
        public router: Router,
        private layoutService: LayoutService,
        private organizationService: OrganizationService,
    ) {
    }

    ngOnInit() {
        this.layoutService.configUpdate$.pipe(
            map((config) => {
                this.darkMode =
                    config.colorScheme === 'dark' ||
                    config.colorScheme === 'dim';
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this.organizationService.currentOrganization$.pipe(
            map(async (org: Organization | undefined) => {
                this.currentOrganization = org;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    protected readonly PlanType = PlanType;
}
