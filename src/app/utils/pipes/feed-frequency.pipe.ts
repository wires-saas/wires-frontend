import { Pipe, PipeTransform } from '@angular/core';
import { Feed } from '../../services/feed.service';

@Pipe({
    name: 'frequency',
    standalone: true,
})
export class FeedFrequencyPipe implements PipeTransform {
    transform(feed: Feed, type: 'auto' | 'manual' = 'manual'): string {
        const granularity =
            type === 'auto'
                ? feed.autoScrapingGranularity
                : feed.scrapingGranularity;
        const interval =
            type === 'auto' ? feed.autoScrapingInterval : feed.scrapingInterval;

        switch (granularity) {
            case 'minute':
                if (interval > 1) {
                    return $localize`Every ${interval} minutes`;
                } else {
                    return $localize`Every minute`;
                }
            case 'hour':
                if (interval > 1) {
                    return $localize`Every ${interval} hours`;
                } else {
                    return $localize`Every hour`;
                }
            case 'day':
                if (interval > 1) {
                    return $localize`Every ${interval} days`;
                } else {
                    return $localize`Every day`;
                }
            default:
                return $localize`N/A`;
        }
    }
}
