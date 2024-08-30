import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AdministrationRoutingModule } from './administration-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';

@NgModule({
    imports: [CommonModule, AdministrationRoutingModule],
    declarations: [],
    providers: [ConfirmationService, MessageService],
})
export class AdministrationModule {}
