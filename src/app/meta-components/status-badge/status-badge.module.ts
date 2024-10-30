import { NgModule } from '@angular/core';
import { StatusBadgeComponent } from './status-badge.component';
import { NgSwitch, NgSwitchCase, NgSwitchDefault } from '@angular/common';
import { TagModule } from 'primeng/tag';
import { FeedRunStatusPipe } from '../../utils/pipes/feed-run-status.pipe';
import { SenderStatusPipe } from '../../utils/pipes/sender-status.pipe';
import { DomainStatusPipe } from '../../utils/pipes/domain-status.pipe';

@NgModule({
    imports: [
        NgSwitch,
        TagModule,
        FeedRunStatusPipe,
        NgSwitchCase,
        NgSwitchDefault,
        SenderStatusPipe,
        DomainStatusPipe,
    ],
    exports: [StatusBadgeComponent],
    declarations: [StatusBadgeComponent],
})
export class StatusBadgeModule {}
