import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Feed } from '../../../../services/feed.service';
import { CheckboxChangeEvent } from 'primeng/checkbox';

@Component({
    selector: 'app-feed-list',
    templateUrl: './feed-list.component.html',
})
export class FeedListComponent {
    @Input() loading: boolean = true;

    @Input() feeds!: Feed[];

    @Input() canRunFeed: boolean = false;
    @Output() onRunFeed: EventEmitter<Feed> = new EventEmitter<Feed>();

    @Input() canEditFeed: boolean = false;
    @Output() onEditFeed: EventEmitter<Feed> = new EventEmitter<Feed>();

    @Input() canDeleteFeed: boolean = false;
    @Output() onDeleteFeed: EventEmitter<Feed> = new EventEmitter<Feed>();

    @Output() onEnableFeed: EventEmitter<Feed> = new EventEmitter<Feed>();
    @Output() onDisableFeed: EventEmitter<Feed> = new EventEmitter<Feed>();

    async onCheckboxChange(event: CheckboxChangeEvent, feed: Feed) {
        event.originalEvent?.stopPropagation();

        if (event.checked) {
            this.onEnableFeed.emit(feed);
        } else {
            this.onDisableFeed.emit(feed);
        }
    }

    autoScrapingRelevant(feed: Feed) {
        return !!(
            feed.scrapingEnabled &&
            feed.autoScrapingEnabled &&
            feed.autoScrapingInterval &&
            feed.autoScrapingGranularity &&
            feed.autoScrapingInterval !== feed.scrapingInterval
        );
    }
}
