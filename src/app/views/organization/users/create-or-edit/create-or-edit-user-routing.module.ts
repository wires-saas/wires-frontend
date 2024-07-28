import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CreateOrEditUserComponent } from './create-or-edit-user.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: CreateOrEditUserComponent }
	])],
	exports: [RouterModule]
})
export class CreateOrEditUserRoutingModule { }
