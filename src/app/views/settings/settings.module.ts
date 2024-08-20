import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingsRoutingModule } from './settings-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
    declarations: [],
    imports: [
        CommonModule,
        SettingsRoutingModule
    ],
    providers: [ConfirmationService, MessageService]
})
export class SettingsModule { }
