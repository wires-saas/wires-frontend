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
import { ConfigurationComponent } from './configuration.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { CheckboxModule } from 'primeng/checkbox';
import { PlansModule } from '../../../meta-components/plans/plans.module';
import { InputSwitchModule } from 'primeng/inputswitch';
import { SelectButtonModule } from 'primeng/selectbutton';
import { ToastModule } from 'primeng/toast';
import { MultiSelectModule } from 'primeng/multiselect';
import { RolePipe } from '../../../utils/pipes/role.pipe';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        ConfigurationRoutingModule,
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
        MultiSelectModule,
        RolePipe
    ],
    declarations: [ConfigurationComponent]
})
export class ConfigurationModule { }
