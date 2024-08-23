import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';

export interface Feed {
    id: number;
    name?: string;
    description?: string;

    scrapingFrequency?: number;
    scrapingGranularity?: 'day' | 'hour' | 'minute';
    scrapingEnabled?: boolean;

    autoScrapingFrequency?: number;
    autoScrapingGranularity?: 'day' | 'hour' | 'minute';
    autoScrapingEnabled?: boolean;

    totalArticles?: number;
    lastWeekArticles?: number;

    urls?: string[];
}

export interface Member {
    name?: string;
    image?: string;
}

export interface DialogConfig {
    visible: boolean;
    header?: string;
    newFeed?: boolean;
}

@Injectable()
export class FeedService {

    dialogConfig: DialogConfig = {
        visible: false,
        header: '',
        newFeed: false
    };

    private feeds: Feed[] = [];

    public autoSchedule: boolean = true;

    private feedSource$$ = new BehaviorSubject<Feed[]>(this.feeds);

    private selectedFeed$$ = new Subject<Feed>();

    private dialogSource$$ = new BehaviorSubject<DialogConfig>(this.dialogConfig);

    feedSource$ = this.feedSource$$.asObservable();

    selectedFeed$ = this.selectedFeed$$.asObservable();

    dialogSource$ = this.dialogSource$$.asObservable();

    constructor(private http: HttpClient) {
        this.fetchFeeds();
    }

    fetchFeeds() {
        firstValueFrom(this.http.get<any>('assets/mocks/feeds.json'))
            .then(res => res.data as Feed[])
            .then(data => {
                this.feeds = data.map((f: Feed) => ({
                    ...f,
                    autoScrapingFrequency: Math.floor(Math.random() * 20),
                    autoScrapingGranularity: f.scrapingGranularity,
                    autoScrapingEnabled: this.autoSchedule,
                }));
                this.feedSource$$.next(this.feeds);
            });
    }

    toggleAutoSchedule(enabled: boolean) {
        this.autoSchedule = enabled;

        this.fetchFeeds();
    }

    addFeed(feed: Feed) {
        if (this.feeds.includes(feed)) {
            this.feeds = this.feeds.map(f => f.id === feed.id ? feed : f);
        }
        else {
            this.feeds = [...this.feeds, feed];
        }

        this.feedSource$$.next(this.feeds);
    }

    removeTask(id: number) {
        this.feeds = this.feeds.filter(f => f.id !== id);
        this.feedSource$$.next(this.feeds);
    }

    onTaskSelect(task: Feed) {
        this.selectedFeed$$.next(task);
    }

    updateFeed(feed: Feed) {
        this.feeds = this.feeds.map(f => f.id === feed.id ? feed : f);
        this.feedSource$$.next(this.feeds);
    }

    showDialog(header: string, newFeed: boolean) {
        this.dialogConfig = {
            visible: true,
            header: header,
            newFeed: newFeed
        };

        this.dialogSource$$.next(this.dialogConfig);
    }

    closeDialog() {
        this.dialogConfig = {
            visible: false
        }

        this.dialogSource$$.next(this.dialogConfig);
    }

}
