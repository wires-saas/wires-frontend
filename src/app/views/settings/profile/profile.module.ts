import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { RippleModule } from 'primeng/ripple';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DropdownModule } from 'primeng/dropdown';
import { FileUploadModule } from 'primeng/fileupload';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        ProfileRoutingModule,
        AccordionModule,
        RippleModule,
        ButtonModule,
        ConfirmDialogModule,
        DropdownModule,
        FileUploadModule,
        InputTextModule,
        ReactiveFormsModule,
        ToastModule,
        FormsModule,
    ],
    declarations: [ProfileComponent],
})
export class ProfileModule {}
