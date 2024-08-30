import { Pipe, PipeTransform } from '@angular/core';
import { FeedRun, FeedRunStatus } from '../../services/feed.service';

@Pipe({
    name: 'feedRunStatus',
    standalone: true,
})
export class FeedRunStatusPipe implements PipeTransform {
    transform(feedRun: FeedRun): string {
        switch (feedRun.status) {
            case FeedRunStatus.PENDING:
                return $localize`Pending`;
            case FeedRunStatus.RUNNING:
                return $localize`Running`;
            case FeedRunStatus.COMPLETED:
                return $localize`Completed`;
            case FeedRunStatus.FAILED:
                return $localize`Failed`;
            default:
                return $localize`N/A`;
        }
    }
}
