import { Component, OnInit, inject, DestroyRef, Input } from '@angular/core';
import { MessageService } from 'primeng/api';
import { CreateFeedDto, DialogConfig, Feed, FeedService } from '../../../../services/feed.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MessageUtils } from '../../../../utils/message.utils';

@Component({
    selector: 'app-create-or-update-feed',
    templateUrl: './create-or-update-feed.component.html',
})
export class CreateOrUpdateFeedComponent implements OnInit {

    @Input() organizationSlug!: string;

    private destroyRef = inject(DestroyRef);

    feed!: Required<CreateFeedDto> | Feed;

    dialogConfig: DialogConfig = {header: '', visible: false};

    availableGranularity: any[] = [];

    saving: boolean = false;

    get creation(): boolean {
        return !!this.dialogConfig.newFeed;
    }

    constructor(private messageService: MessageService, private feedService: FeedService) {}

    ngOnInit(): void {

        this.feedService.selectedFeed$.pipe(
            map((data) => this.feed = data),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this.feedService.dialogSource$.pipe(
            map((data => {
                this.dialogConfig = data;

                if(this.dialogConfig.newFeed) {
                    this.resetFeed();
                }
            })),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this.availableGranularity = [
            { label: $localize `Minute(s)`, value: 'minute' },
            { label: $localize `Hour(s)`, value: 'hour' },
            { label: $localize `Day(s)`, value: 'day' },
        ];

        this.resetFeed();
    }

    canSave(): boolean {
        return !!(this.feed.displayName && this.feed.urls?.length && this.feed.scrapingInterval && this.feed.scrapingGranularity);
    }

    async updateFeed() {

        this.saving = true;

        await this.feedService.updateFeed(this.organizationSlug, this.feed).then(() => {
            this.messageService.add({
                severity: 'success',
                summary: $localize `Success`,
                detail: $localize `Feed "${this.feed.displayName}" updated successfully.`
            });

            this.feedService.closeDialog();
        }).catch((err) => {
            console.error(err);

            MessageUtils.parseServerError(this.messageService, err, {
                summary: $localize `Error updating feed`,
            });
        }).finally(() => this.saving = false);
    }

    async testAndCreateFeed() {
        // TODO preview some articles fetched from the feed
        this.saving = true;

        await this.feedService.createFeed(this.organizationSlug, this.feed)
            .then(() => {

                this.messageService.add({
                    severity: 'success',
                    summary: $localize `Success`,
                    detail: $localize `Feed "${this.feed.displayName}" created successfully.`
                });

                this.feedService.closeDialog();

            }).catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize `Error creating feed`,
                });
            }).finally(() => this.saving = false);
    }

    cancelFeed(){
        this.resetFeed();
        this.feedService.closeDialog();
    }

    resetFeed() {
        this.feed = {
            displayName: '',
            description: '',
            scrapingInterval: 30,
            scrapingGranularity: 'minute',
            urls: []
        };
    }

}
