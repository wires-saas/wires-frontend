import { Component, Input } from '@angular/core';
import { FeedRun } from '../../services/feed.service';
import { SenderStatus } from '../../services/sender.service';
import { DomainStatus } from '../../services/domain.service';

@Component({
    selector: 'app-status-badge',
    templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
    @Input() entity: 'FeedRun' | 'Domain' | 'Sender' | '' = '';
    @Input() value!: any;
    protected readonly SenderStatus = SenderStatus;
    protected readonly DomainStatus = DomainStatus;
}
