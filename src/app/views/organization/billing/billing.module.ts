import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingRoutingModule } from './billing-routing.module';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BillingComponent } from './billing.component';
import { AddressPipe } from '../../../utils/pipes/adress.pipe';
import { CountryNamePipe } from '../../../utils/pipes/country-name.pipe';
import { FullNamePipe } from '../../../utils/pipes/full-name.pipe';
import { PlanPricePipe } from '../../../utils/plans/plan-price.pipe';
import { PlanDesignationPipe } from '../../../utils/plans/plan-designation.pipe';
import { LogosModule } from '../../../meta-components/logos/logos.module';

@NgModule({
    imports: [
        CommonModule,
        BillingRoutingModule,
        ButtonModule,
        TableModule,
        AddressPipe,
        CountryNamePipe,
        FullNamePipe,
        PlanPricePipe,
        PlanDesignationPipe,
        LogosModule,
    ],
    declarations: [BillingComponent],
})
export class BillingModule {}
