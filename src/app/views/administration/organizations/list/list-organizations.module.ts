import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ListOrganizationsComponent } from './list-organizations.component';
import { ListOrganizationsRoutingModule } from './list-organizations-routing.module';
import { CountryNamePipe } from '../../../../utils/pipes/country-name.pipe';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import {PlanDesignationPipe} from "../../../../utils/plans/plan-designation.pipe";
import {PlanStatusPipe} from "../../../../utils/plans/plan-status.pipe";

@NgModule({
    imports: [
        CommonModule,
        ListOrganizationsRoutingModule,
        RippleModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        ProgressBarModule,
        CountryNamePipe,
        MenuModule,
        ConfirmDialogModule,
        ToastModule,
        PlanDesignationPipe,
        PlanStatusPipe,
    ],
    declarations: [ListOrganizationsComponent],
})
export class ListOrganizationsModule {}
