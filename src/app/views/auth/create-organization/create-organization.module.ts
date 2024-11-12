import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { CreateOrganizationComponent } from './create-organization.component';
import { CreateOrganizationRoutingModule } from './create-organization-routing.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { PasswordModule } from 'primeng/password';
import {PlanDesignationPipe} from "../../../utils/plans/plan-designation.pipe";
import {InputGroupAddonModule} from "primeng/inputgroupaddon";
import {InputGroupModule} from "primeng/inputgroup";

@NgModule({
    imports: [
        CommonModule,
        CreateOrganizationRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        AppConfigModule,
        PasswordModule,
        PlanDesignationPipe,
        InputGroupAddonModule,
        InputGroupModule,
        ReactiveFormsModule,
    ],
    declarations: [CreateOrganizationComponent],
})
export class CreateOrganizationModule {}
