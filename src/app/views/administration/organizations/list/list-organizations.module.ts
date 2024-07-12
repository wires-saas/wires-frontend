import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ListOrganizationsComponent } from './list-organizations.component';
import { ListOrganizationsRoutingModule } from './list-organizations-routing.module';

@NgModule({
	imports: [
		CommonModule,
		ListOrganizationsRoutingModule,
		RippleModule,
		ButtonModule,
		InputTextModule,
		TableModule,
		ProgressBarModule
	],
	declarations: [ListOrganizationsComponent]
})
export class ListOrganizationsModule { }
