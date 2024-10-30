import { Pipe, PipeTransform } from '@angular/core';
import { FeedRun, FeedRunStatus } from '../../services/feed.service';
import { Sender, SenderStatus } from '../../services/sender.service';

@Pipe({
    name: 'senderStatus',
    standalone: true,
})
export class SenderStatusPipe implements PipeTransform {
    transform(sender: Sender): string {
        switch (sender.status) {
            case SenderStatus.Available:
                return $localize`Available`;
            case SenderStatus.Unavailable:
                return $localize`Pending Domain`;
            default:
                return $localize`N/A`;
        }
    }
}
