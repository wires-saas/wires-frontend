import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContactsComponent } from './contacts.component';
import { NoContactComponent } from './no-contact/no-contact.component';
import { ListContactsComponent } from './list/list-contacts.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactsService } from '../../../services/contacts.service';
import { FileUploadModule } from 'primeng/fileupload';
import { ToastModule } from 'primeng/toast';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TableModule } from 'primeng/table';
import { MenuModule } from 'primeng/menu';
import { InputTextModule } from 'primeng/inputtext';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ErrorFetchingContactsComponent } from './error-fetching-contacts/error-fetching-contacts.component';
import { ErrorCardComponent } from 'src/app/meta-components/error-card/error-card.component';
import { SkeletonModule } from 'primeng/skeleton';
import { UploadComponent } from './upload/upload.component';
import { IconFieldModule } from 'primeng/iconfield';
import { InputIconModule } from 'primeng/inputicon';

@NgModule({
    imports: [
        ContactsRoutingModule,
        CommonModule,
        FileUploadModule,
        ToastModule,
        ButtonModule,
        RippleModule,
        TableModule,
        MenuModule,
        InputTextModule,
        TagModule,
        ConfirmDialogModule,
        DropdownModule,
        FormsModule,
        ErrorCardComponent,
        SkeletonModule,
        ReactiveFormsModule,
        IconFieldModule,
        InputIconModule
    ],
    declarations: [
        ContactsComponent,
        NoContactComponent,
        ErrorFetchingContactsComponent,
        ListContactsComponent,
        UploadComponent
    ],
    providers: [MessageService, ContactsService, ConfirmationService],
})
export class ContactsModule {}
