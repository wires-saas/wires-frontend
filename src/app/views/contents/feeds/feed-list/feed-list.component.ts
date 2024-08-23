import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Feed, FeedService } from '../service/feed.service';

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
            { label: 'Edit', icon: 'pi pi-pencil', command: () => this.onEdit() },
            { label: 'Delete', icon: 'pi pi-trash', command: () => this.handleDelete() }
        ];
    }

    parseDate(date: Date) {
        let d = new Date(date);
        return d.toUTCString().split(' ').slice(1, 3).join(' ');
    }

    handleDelete() {
        this.feedService.removeTask(this.clickedFeed.id);
    }

    toggleMenu(event: Event, feed: Feed) {
        this.clickedFeed = feed;
        this.menu.toggle(event);
    }

    onEdit() {
        this.feedService.onTaskSelect(this.clickedFeed);
        this.feedService.showDialog('Edit Feed', false);
    }

    onCheckboxChange(event: any, feed: Feed) {
        event.originalEvent.stopPropagation();
        feed.scrapingEnabled = event.checked;
        this.feedService.updateFeed(feed);
    }

    autoScrapingRelevant(feed: Feed) {
        return !!(feed.scrapingEnabled
            && feed.autoScrapingEnabled
            && feed.autoScrapingFrequency
            && feed.autoScrapingGranularity
            && feed.autoScrapingFrequency !== feed.scrapingFrequency);
    }
}
