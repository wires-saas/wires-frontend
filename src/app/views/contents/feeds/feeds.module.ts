import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { FeedsRoutingModule } from './feeds-routing.module';
import { FeedsComponent } from './feeds.component';
import { CreateFeedComponent } from './create-feed/create-feed.component';
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
import { FeedService } from './service/feed.service';
import { RippleModule } from 'primeng/ripple';
import { ChipsModule } from 'primeng/chips';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { ArraySortPipe } from '../../../utils/array-sort.pipe';
import { ToggleButtonModule } from 'primeng/togglebutton';

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
        ToggleButtonModule
    ],
    declarations: [FeedsComponent, CreateFeedComponent, FeedListComponent],
    providers: [FeedService]
})
export class FeedsModule { }
