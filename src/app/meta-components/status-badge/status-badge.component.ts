import { Component, Input } from '@angular/core';
import { FeedRun } from '../../services/feed.service';

@Component({
    selector: 'app-status-badge',
    templateUrl: './status-badge.component.html',
})
export class StatusBadgeComponent {
    @Input() value!: FeedRun;
}
