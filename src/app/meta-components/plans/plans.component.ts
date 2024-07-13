import { Component, Input, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './plans.component.html',
    selector: 'app-plans',
})
export class PlansComponent implements OnDestroy {

    subscription: Subscription;

    darkMode: boolean = false;

    @Input() planEnabled: 'basic' | 'extended' | 'entreprise' | 'none' = 'none';
    @Input() forLanding: boolean = false;

    constructor(public router: Router, private layoutService: LayoutService) {
        this.subscription = this.layoutService.configUpdate$.subscribe(config => {
            this.darkMode = config.colorScheme === 'dark' || config.colorScheme === 'dim';
        });
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    selectPlan(plan: 'basic' | 'extended' | 'entreprise') {

        if (this.forLanding) {
            // TODO open contact form ?
            return;
        }

        this.planEnabled = plan;
    }
}
