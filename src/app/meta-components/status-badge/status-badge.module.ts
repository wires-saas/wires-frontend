import { NgModule } from '@angular/core';
import { StatusBadgeComponent } from './status-badge.component';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { FeedRunStatusPipe } from '../../utils/pipes/feed-run-status.pipe';

@NgModule({
    imports: [
        NgSwitch,
        TagModule,
        FeedRunStatusPipe,
        NgSwitchCase,
        NgSwitchDefault
    ],
    exports: [
        StatusBadgeComponent,
    ],
    declarations: [
        StatusBadgeComponent,
    ]
})
export class StatusBadgeModule { }
