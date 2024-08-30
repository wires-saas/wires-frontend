import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LandingRoutingModule } from './landing-routing.module';
import { LandingComponent } from './landing.component';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { AnimateEnterDirective } from './animateenter.directive';
import { PlansModule } from '../../meta-components/plans/plans.module';
import { LogosModule } from '../../meta-components/logos/logos.module';

@NgModule({
    imports: [
        CommonModule,
        LandingRoutingModule,
        ButtonModule,
        RouterModule,
        StyleClassModule,
        AppConfigModule,
        PlansModule,
        LogosModule,
        LogosModule,
    ],
    declarations: [LandingComponent, AnimateEnterDirective],
})
export class LandingModule {}
