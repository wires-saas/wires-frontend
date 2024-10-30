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
import { SkeletonModule } from 'primeng/skeleton';
import { ArraySortPipe } from '../../../utils/pipes/array-sort.pipe';
import { MenuModule } from 'primeng/menu';
import { CheckboxModule } from 'primeng/checkbox';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ContactsService } from '../../../services/contacts.service';
import { GenericDataCardComponent } from '../../../meta-components/generic-data-card/generic-data-card.component';
import { GenericDataListComponent } from '../../../meta-components/generic-data-list/generic-data-list.component';
import { GenericLayoutSingleInstanceComponent } from '../../../meta-components/generic-layout-single-instance/generic-layout-single-instance.component';
import { FeedRunStatusPipe } from '../../../utils/pipes/feed-run-status.pipe';
import { GenericSquareCardsRowComponent } from '../../../meta-components/generic-square-cards-row/generic-square-cards-row.component';
import { CapitalizePipe } from '../../../utils/pipes/capitalize.pipe';
import { WipComponent } from '../../../meta-components/wip/wip.component';
import { AudienceConfigurationComponent } from './configuration.component';
import { ContactsProvidersComponent } from './contacts-providers/contacts-providers.component';
import { ContactsProviderComponent } from './contacts-providers/contacts-provider/contacts-provider.component';
import { ContactsProviderListComponent } from './contacts-providers/contacts-provider-list/contacts-provider-list.component';
import { CreateOrUpdateContactsProviderComponent } from './contacts-providers/create-or-update-contacts-provider/create-or-update-contacts-provider.component';
import { ConfigurationRoutingModule } from './configuration-routing.module';
import { EmailsProviderComponent } from './emails-providers/emails-provider/emails-provider.component';
import { EmailsProviderListComponent } from './emails-providers/emails-provider-list/emails-provider-list.component';
import { CreateOrUpdateEmailsProviderComponent } from './emails-providers/create-or-update-emails-provider/create-or-update-emails-provider.component';
import { EmailsProvidersComponent } from './emails-providers/emails-providers.component';
import { EmailsService } from '../../../services/emails.service';
import { SenderListComponent } from './emails-providers/emails-provider/senders/sender-list/sender-list.component';
import { DurationPipe } from '../../../utils/pipes/duration.pipe';
import { GenericDataTableComponent } from '../../../meta-components/generic-data-table/generic-data-table.component';
import { StatusBadgeModule } from '../../../meta-components/status-badge/status-badge.module';
import {
    CreateOrUpdateSenderComponent
} from './emails-providers/emails-provider/senders/create-or-update-sender/create-or-update-sender.component';
import { ApiService } from '../../../services/api.service';
import { SenderService } from '../../../services/sender.service';
import { DomainListComponent } from './emails-providers/emails-provider/domains/domain-list/domain-list.component';
import { DomainService } from '../../../services/domain.service';
import {
    CreateDomainComponent
} from './emails-providers/emails-provider/domains/create-domain/create-domain.component';

@NgModule({
    imports: [
        ConfigurationRoutingModule,
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
        FeedRunStatusPipe,
        GenericSquareCardsRowComponent,
        CapitalizePipe,
        WipComponent,
        DurationPipe,
        GenericDataTableComponent,
        StatusBadgeModule,
    ],
    declarations: [
        AudienceConfigurationComponent,
        ContactsProvidersComponent,
        ContactsProviderComponent,
        ContactsProviderListComponent,
        CreateOrUpdateContactsProviderComponent,

        EmailsProvidersComponent,
        EmailsProviderComponent,
        EmailsProviderListComponent,
        CreateOrUpdateEmailsProviderComponent,

        SenderListComponent,
        CreateOrUpdateSenderComponent,

        DomainListComponent,
        CreateDomainComponent,
    ],
    providers: [
        ApiService,
        MessageService,
        ConfirmationService,
        ContactsService,
        EmailsService,
        DomainService,
        SenderService,
    ],
})
export class ConfigurationModule {}
