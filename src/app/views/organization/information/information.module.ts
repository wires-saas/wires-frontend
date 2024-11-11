import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { InputGroupModule } from 'primeng/inputgroup';
import { InformationComponent } from './information.component';
import { InformationRoutingModule } from './information-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { PlansModule } from '../../../meta-components/plans/plans.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        InformationRoutingModule,
        ButtonModule,
        RippleModule,
        InputTextModule,
        DropdownModule,
        FileUploadModule,
        InputTextareaModule,
        InputGroupModule,
        InputGroupAddonModule,
        CheckboxModule,
        PlansModule,
        InputSwitchModule,
        SelectButtonModule,
        ReactiveFormsModule,
        ToastModule,
    ],
    declarations: [InformationComponent],
})
export class InformationModule {}
