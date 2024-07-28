import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrganizationRoutingModule } from './organization-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
    imports: [
        CommonModule,
        OrganizationRoutingModule
    ],
    declarations: [],
    providers: [ConfirmationService, MessageService]
})
export class OrganizationModule { }
