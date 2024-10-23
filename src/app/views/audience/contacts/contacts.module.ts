import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ContactsComponent } from './contacts.component';
import { ContactsRoutingModule } from './contacts-routing.module';
import { ContactsProviderListComponent } from './contacts-providers/contacts-provider-list/contacts-provider-list.component';
import { SkeletonModule } from 'primeng/skeleton';
import { ArraySortPipe } from '../../../utils/pipes/array-sort.pipe';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactsService } from '../../../services/contacts.service';
import {
    CreateOrUpdateContactsProviderComponent
} from './contacts-providers/create-or-update-contacts-provider/create-or-update-contacts-provider.component';
import {
    ContactsProvidersComponent
} from './contacts-providers/contacts-providers.component';
import { GenericDataCardComponent } from '../../../meta-components/generic-data-card/generic-data-card.component';
import { GenericDataListComponent } from '../../../meta-components/generic-data-list/generic-data-list.component';
import { ContactsProviderComponent } from './contacts-providers/contacts-provider/contacts-provider.component';
import {
    GenericLayoutSingleInstanceComponent
} from '../../../meta-components/generic-layout-single-instance/generic-layout-single-instance.component';

@NgModule({
    imports: [
        ContactsRoutingModule,
        CommonModule,
        FormsModule,
        TableModule,
        RatingModule,
        ButtonModule,
        InputNumberModule,
        InputTextareaModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        TooltipModule,
        ChipsModule,
        DialogModule,
        SkeletonModule,
        ArraySortPipe,
        MenuModule,
        CheckboxModule,
        ConfirmDialogModule,
        GenericDataCardComponent,
        GenericDataListComponent,
        GenericLayoutSingleInstanceComponent,
    ],
    declarations: [
        ContactsComponent,
        ContactsProvidersComponent,
        ContactsProviderComponent,
        ContactsProviderListComponent,
        CreateOrUpdateContactsProviderComponent],
    providers: [MessageService, ContactsService, ConfirmationService],
})
export class ContactsModule {}
