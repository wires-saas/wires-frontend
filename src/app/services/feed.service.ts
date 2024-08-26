import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Article } from './article.service';

export interface Feed {
    _id: string;
    urls: string[];

    organization: string;

    displayName: string;
    description: string;

    scrapingInterval: number;
    scrapingGranularity: 'day' | 'hour' | 'minute';
    scrapingEnabled: boolean;

    autoScrapingInterval: number;
    autoScrapingGranularity: 'day' | 'hour' | 'minute';
    autoScrapingEnabled: boolean;

    totalArticles?: number;
    lastWeekArticles?: number;

    authorizationType?: AuthorizationType;
    authorizationUsername?: string;
    authorizationToken?: string;
}

export enum FeedRunStatus {
    PENDING = 'pending',
    RUNNING = 'running',
    COMPLETED = 'completed',
    FAILED = 'failed',
}

export interface FeedRun {
    _id: string;
    feed: string;
    status: FeedRunStatus;
    createdAt: string;
    updatedAt: string;
    articles: Article[];
    newArticles: string[];
    scrapingDurationMs: number;
    articlesCreationMs: number;
}

export interface FeedRunPopulated extends Omit<FeedRun, 'feed'> {
    feed: Feed;
}

export interface CreateFeedDto extends Pick<Feed, 'displayName' | 'description' | 'urls' | 'scrapingInterval' | 'scrapingGranularity' > {}
export interface UpdateFeedDto extends Partial<Pick<Feed, 'displayName' | 'description' | 'urls' | 'scrapingInterval' | 'scrapingGranularity'>> {}

export enum AuthorizationType {
    NONE = 'none',
    BASIC = 'basic',
    BEARER = 'bearer',
    API_KEY = 'apikey'
}

export interface DialogConfig {
    visible: boolean;
    header?: string;
    newFeed?: boolean;
}

@Injectable()
export class FeedService {

    private domain: string;

    dialogConfig: DialogConfig = {
        visible: false,
        header: '',
        newFeed: false
    };

    public autoSchedule: boolean = true;

    private feeds$$: BehaviorSubject<Feed[]> = new BehaviorSubject<Feed[]>([]);

    private selectedFeed$$: Subject<Feed> = new Subject<Feed>();

    private dialogSource$$: BehaviorSubject<DialogConfig> = new BehaviorSubject<DialogConfig>(this.dialogConfig);

    public feeds$: Observable<Feed[]> = this.feeds$$.asObservable();

    selectedFeed$: Observable<Feed> = this.selectedFeed$$.asObservable();

    dialogSource$: Observable<DialogConfig> = this.dialogSource$$.asObservable();

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async fetchFeeds(organizationId: string): Promise<Feed[]> {
        return firstValueFrom(this.http.get<Feed[]>(`${this.domain}/organizations/${organizationId}/feeds`))
            .then((feeds) => {
                this.feeds$$.next(feeds);
                return feeds;
            });
    }

    async getFeed(organizationId: string, feedId: string): Promise<Feed> {
        return firstValueFrom(this.http.get<Feed>(`${this.domain}/organizations/${organizationId}/feeds/${feedId}`))
    }

    // TODO not implemented yet
    toggleAutoSchedule(enabled: boolean) {
        this.autoSchedule = enabled;

        // this.fetchFeeds();
    }

    async createFeed(organizationId: string, feedRequest: CreateFeedDto): Promise<Feed> {

        // cleaning urls
        feedRequest['urls'] = feedRequest['urls'].map(_ => _?.trim()).filter(_ => !!_);

        return firstValueFrom(this.http.post<Feed>(`${this.domain}/organizations/${organizationId}/feeds`, feedRequest))
            .then((createdFeed) => {
                const feeds = this.feeds$$.getValue();
                this.feeds$$.next([...feeds, createdFeed]);
                return createdFeed;
            });
    }

    private convertPartialFeedToUpdateFeedDto(feed: Partial<Feed>): UpdateFeedDto {
        const updatableKeys: Array<keyof UpdateFeedDto> = ['displayName', 'description', 'urls', 'scrapingInterval', 'scrapingGranularity'];

        const dto: UpdateFeedDto = {};

        updatableKeys.forEach((key: keyof UpdateFeedDto) => {
            if (feed[key] !== undefined) {
                // cleaning urls
                if (key === 'urls') dto['urls'] = feed['urls']?.map(_ => _?.trim()).filter(_ => !!_);
                else dto[key] = feed[key] as any;
            }
        });

        return dto;
    }

    async updateFeed(organizationId: string, feed: Partial<Feed>): Promise<Feed> {
        const dto: UpdateFeedDto = this.convertPartialFeedToUpdateFeedDto(feed);

        return firstValueFrom(this.http.patch<Feed>(`${this.domain}/organizations/${organizationId}/feeds/${feed._id}`, {
            ...dto
        }))
            .then((updatedFeed) => {
                const feeds = this.feeds$$.getValue().map(f => updatedFeed._id === f._id ? updatedFeed : f);
                this.feeds$$.next([...feeds]);
                return updatedFeed;
            });
    }

    async runFeed(organizationId: string, feed: Partial<Feed>): Promise<any> {
        return firstValueFrom(this.http.post<any>(`${this.domain}/organizations/${organizationId}/feeds/${feed._id}/runs`, {}));
    }

    async getFeedRun(organizationId: string, feedId: string, runId: string): Promise<FeedRun> {
        return firstValueFrom(this.http.get<FeedRun>(`${this.domain}/organizations/${organizationId}/feeds/${feedId}/runs/${runId}`));
    }

    async getFeedRuns(organizationId: string): Promise<FeedRun[]> {
        return firstValueFrom(this.http.get<FeedRun[]>(`${this.domain}/organizations/${organizationId}/feeds/runs`));
    }

    async toggleFeed(organizationId: string, feedId: string, scrapingEnabled: boolean) {
        return firstValueFrom(this.http.patch<Feed>(`${this.domain}/organizations/${organizationId}/feeds/${feedId}`,
            { scrapingEnabled }))
            .then((feed) => {
                const feeds = this.feeds$$.getValue().map(f => f._id === feedId ? feed : f);
                this.feeds$$.next(feeds);
            });
    }

    async removeFeed(organizationId: string, feedId: string): Promise<void> {
        return firstValueFrom(this.http.delete<Feed>(`${this.domain}/organizations/${organizationId}/feeds/${feedId}`))
            .then(() => {
                const feeds: Feed[] = this.feeds$$.getValue().filter(f => f._id !== feedId);
                this.feeds$$.next(feeds);
            });
    }

    onFeedSelect(feed: Feed) {
        this.selectedFeed$$.next(feed);
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
        this.dialogConfig = { visible: false };
        this.dialogSource$$.next(this.dialogConfig);
    }

}
