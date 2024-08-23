import { Component, OnDestroy } from '@angular/core';
import { Feed, FeedService } from './service/feed.service';
import { Subscription } from 'rxjs';
import { ToggleButtonChangeEvent } from 'primeng/togglebutton';

@Component({
    templateUrl: './feeds.component.html'
})
export class FeedsComponent implements OnDestroy {

    subscription: Subscription;

    feeds: Feed[] = [];

    autoSchedule: boolean = false;

    constructor(private feedService: FeedService) {
        this.autoSchedule = this.feedService.autoSchedule;
        this.subscription = this.feedService.feedSource$.subscribe(data => this.categorize(data));
    }

    categorize(feeds: Feed[]) {
        this.feeds = feeds;
    }

    toggleAutoSchedule(e: ToggleButtonChangeEvent) {
        this.feedService.toggleAutoSchedule(!!e.checked);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.feedService.showDialog('Create Feed', true);
    }
}
