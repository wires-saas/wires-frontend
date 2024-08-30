import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverviewDashboardComponent } from './overview.dashboard.component';
import { OverviewDashboardRoutingModule } from './overview.dashboard-routing.module';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputTextModule } from 'primeng/inputtext';
import { ChartModule } from 'primeng/chart';
import { KnobModule } from 'primeng/knob';
import { RatingModule } from 'primeng/rating';
import { RippleModule } from 'primeng/ripple';

@NgModule({
    imports: [
        CommonModule,
        OverviewDashboardRoutingModule,
        ButtonModule,
        RippleModule,
        DropdownModule,
        FormsModule,
        TableModule,
        InputTextModule,
        InputTextareaModule,
        ChartModule,
        RatingModule,
        KnobModule,
    ],
    declarations: [OverviewDashboardComponent],
})
export class OverviewDashboardModule {}
