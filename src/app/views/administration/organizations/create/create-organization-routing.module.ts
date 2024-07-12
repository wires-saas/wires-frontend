import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateOrganizationComponent } from './create-organization.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateOrganizationComponent }
	])],
	exports: [RouterModule]
})
export class CreateOrganizationRoutingModule { }
