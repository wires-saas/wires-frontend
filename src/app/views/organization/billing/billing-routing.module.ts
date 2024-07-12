import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BillingComponent } from './billing.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: BillingComponent }
	])],
	exports: [RouterModule]
})
export class BillingRoutingModule { }
