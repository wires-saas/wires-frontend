import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactsService } from '../../../services/contacts.service';

@NgModule({
    imports: [ContactsRoutingModule, CommonModule],
    declarations: [ContactsComponent],
    providers: [MessageService, ContactsService, ConfirmationService],
})
export class ContactsModule {}
