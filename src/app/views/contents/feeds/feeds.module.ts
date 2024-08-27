import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedsRoutingModule } from './feeds-routing.module';
import { FeedsComponent } from './feeds.component';
import { CreateOrUpdateFeedComponent } from './create-or-update-feed/create-or-update-feed.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { EditorModule } from 'primeng/editor'
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { ToastModule } from 'primeng/toast';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { AvatarGroupModule } from 'primeng/avatargroup';
import { CheckboxModule } from 'primeng/checkbox';
import { DialogModule } from 'primeng/dialog';
import { FeedListComponent } from './feed-list/feed-list.component'
import { FeedService } from '../../../services/feed.service';
import { RippleModule } from 'primeng/ripple';
import { ChipsModule } from 'primeng/chips';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ArraySortPipe } from '../../../utils/pipes/array-sort.pipe';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmationService, MessageService } from 'primeng/api';
import { FeedFrequencyPipe } from '../../../utils/pipes/feed-frequency.pipe';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FeedRunComponent } from './feed-run/feed-run.component';
import { ArticlesViewModule } from '../../../meta-components/articles-view/articles-view.module';
import { DividerModule } from 'primeng/divider';
import { FeedRunStatusPipe } from '../../../utils/pipes/feed-run-status.pipe';
import { StyleClassModule } from 'primeng/styleclass';
import { FeedRunListComponent } from './feed-run-list/feed-run-list.component';
import { TableModule } from 'primeng/table';
import { StatusBadgeModule } from '../../../meta-components/status-badge/status-badge.module';
import { DurationPipe } from '../../../utils/pipes/duration.pipe';
import { SkeletonModule } from 'primeng/skeleton';

@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        FeedsRoutingModule,
        ButtonModule,
        InputTextModule,
        EditorModule,
        CalendarModule,
        ToastModule,
        AutoCompleteModule,
        AvatarModule,
        AvatarGroupModule,
        CheckboxModule,
        MenuModule,
        DialogModule,
        RippleModule,
        ChipsModule,
        InputNumberModule,
        DropdownModule,
        InputTextareaModule,
        ArraySortPipe,
        ToggleButtonModule,
        FeedFrequencyPipe,
        ConfirmDialogModule,
        ArticlesViewModule,
        DividerModule,
        FeedRunStatusPipe,
        StyleClassModule,
        TableModule,
        StatusBadgeModule,
        DurationPipe,
        SkeletonModule
    ],
    declarations: [
        FeedsComponent,
        CreateOrUpdateFeedComponent,
        FeedListComponent,
        FeedRunComponent,
        FeedRunListComponent
    ],
    providers: [FeedService, MessageService, ConfirmationService]
})
export class FeedsModule { }
