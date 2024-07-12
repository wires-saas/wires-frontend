import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BillingRoutingModule } from './billing-routing.module';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';
import { BillingComponent } from './billing.component';

@NgModule({
	imports: [
		CommonModule,
		BillingRoutingModule,
		ButtonModule,
		TableModule
	],
	declarations: [BillingComponent]
})
export class BillingModule { }
