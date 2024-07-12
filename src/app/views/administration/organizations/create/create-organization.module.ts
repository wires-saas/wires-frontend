import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { CreateOrganizationComponent } from './create-organization.component';
import { CreateOrganizationRoutingModule } from './create-organization-routing.module';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';

@NgModule({
	imports: [
		CommonModule,
		FormsModule,
		CreateOrganizationRoutingModule,
		ButtonModule,
		RippleModule,
		InputTextModule,
		DropdownModule,
		FileUploadModule,
		InputTextareaModule,
		InputGroupModule,
        InputGroupAddonModule
	],
	declarations: [CreateOrganizationComponent]
})
export class CreateOrganizationModule { }
