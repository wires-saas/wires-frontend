import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InformationRoutingModule } from './information-routing.module';
import { InformationComponent } from './information.component';

@NgModule({
	imports: [
		CommonModule,
		InformationRoutingModule
	],
	declarations: [InformationComponent]
})
export class InformationModule { }
