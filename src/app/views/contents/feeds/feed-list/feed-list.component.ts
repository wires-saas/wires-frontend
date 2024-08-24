import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Feed, FeedService } from '../../../../services/feed.service';

@Component({
    selector: 'app-feed-list',
    templateUrl: './feed-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedListComponent implements OnInit {

    @Input() feeds!: Feed[];

    @Input() title!: string;

    @ViewChild('menu') menu!: Menu;

    menuItems: MenuItem[] = [];

    clickedFeed!: Feed;

    constructor(private feedService: FeedService) { }

    ngOnInit(): void {
        this.menuItems = [
            { label: $localize `Edit`, icon: 'pi pi-pencil', command: () => this.onEdit() },
            { label: $localize `Delete`, icon: 'pi pi-trash', command: () => this.handleDelete() }
        ];
    }

    async handleDelete() {
        await this.feedService.removeFeed(this.clickedFeed.organization, this.clickedFeed._id);
    }

    toggleMenu(event: Event, feed: Feed) {
        this.clickedFeed = feed;
        this.menu.toggle(event);
    }

    onEdit() {
        this.feedService.onFeedSelect(this.clickedFeed);
        this.feedService.showDialog($localize `Edit Feed`, false);
    }

    async onCheckboxChange(event: any, feed: Feed) {
        event.originalEvent.stopPropagation();
        await this.feedService.toggleFeed(feed.organization, feed._id, event.checked);
    }

    autoScrapingRelevant(feed: Feed) {
        return !!(feed.scrapingEnabled
            && feed.autoScrapingEnabled
            && feed.autoScrapingInterval
            && feed.autoScrapingGranularity
            && feed.autoScrapingInterval !== feed.scrapingInterval);
    }
}
