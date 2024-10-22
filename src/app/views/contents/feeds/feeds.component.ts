import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    Feed,
    FeedRun,
    FeedRunPopulated,
    FeedService,
} from '../../../services/feed.service';
import { ToggleButtonChangeEvent } from 'primeng/togglebutton';
import { Organization, OrganizationService } from '../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Slug } from '../../../utils/types.utils';
import { ActivatedRoute, Router } from '@angular/router';
import {
    CreateContactsProvider,
    CreateFeed, CreateFeedRun, DeleteContactsProvider, DeleteFeed,
    ReadFeedRun,
    UpdateContactsProvider,
    UpdateFeed
} from '../../../utils/permission.utils';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../../../services/auth.service';
import { MessageUtils } from '../../../utils/message.utils';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    templateUrl: './feeds.component.html',
})
export class FeedsComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    currentOrgSlug: Slug | undefined;

    feeds: Feed[] = [];

    feedRuns: FeedRun[] = [];

    autoSchedule: boolean = false;

    loading: boolean = true;

    canCreateFeed: boolean = false;
    canRunFeed: boolean = false;
    canEditFeed: boolean = false;
    canDeleteFeed: boolean = false;


    constructor(
        private authService: AuthService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private organizationService: OrganizationService,
        private feedService: FeedService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        this.autoSchedule = this.feedService.autoSchedule;
    }

    async ngOnInit() {
        this.feedService.feeds$
            .pipe(
                map((feeds) => (this.feeds = feeds)),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.organizationService.currentOrganization$
            .pipe(
                map(async (org) => {
                    this.currentOrgSlug = org?.slug;
                    if (org) {
                        this.loading = true;
                        await this.loadPermissions(org);
                        await this.feedService.getFeeds(org.slug);
                        this.feedRuns = await this.feedService.getFeedRuns(
                            org.slug,
                        );
                        this.loading = false;
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private async loadPermissions(organization: Organization) {

        this.canCreateFeed = await firstValueFrom(
            this.authService.hasPermission$(CreateFeed, organization.slug)
        );

        this.canRunFeed = await firstValueFrom(
            this.authService.hasPermission$(CreateFeedRun, organization.slug)
        );

        this.canEditFeed = await firstValueFrom(
            this.authService.hasPermission$(UpdateFeed, organization.slug)
        );

        this.canDeleteFeed = await firstValueFrom(
            this.authService.hasPermission$(DeleteFeed, organization.slug)
        );

        // TODO: Implement the following methods
        this.canCreateFeed = true;
        this.canRunFeed = true;
        this.canEditFeed = true;
        this.canDeleteFeed = true;
    }

    toggleAutoSchedule(e: ToggleButtonChangeEvent) {
        this.feedService.toggleAutoSchedule(!!e.checked);
    }

    showDialog() {
        this.feedService.showDialog($localize`Create Feed`, true);
    }

    async navigateToFeedRun(run: FeedRun | FeedRunPopulated) {
        const feedId: string =
            typeof run.feed === 'string' ? run.feed : run.feed._id;

        await this.router.navigate([feedId, 'runs', run._id], {
            relativeTo: this.route,
        });
    }

    async onEnableFeed(feed: Feed) {
        this.feedService.toggleFeed(feed.organization, feed._id, true).then(() => {
            this.messageService.add({
                severity: 'info',
                summary: $localize`Success`,
                detail: $localize`Feed "${feed.displayName}" enabled.`,
            });
        }).catch((err) => {
            console.error(err);
            MessageUtils.parseServerError(this.messageService, err, {
                summary: $localize`Error enabling feed`,
            });
        });
    }

    async onDisableFeed(feed: Feed) {
        this.feedService.toggleFeed(feed.organization, feed._id, false).then(() => {
            this.messageService.add({
                severity: 'info',
                summary: $localize`Success`,
                detail: $localize`Feed "${feed.displayName}" disabled.`,
            });
        }).catch((err) => {
            console.error(err);
            MessageUtils.parseServerError(this.messageService, err, {
                summary: $localize`Error disabling feed`,
            });
        });
    }

    async onRunFeed(feed: Feed) {
        this.feedService.onFeedSelect(feed);

        this.messageService.add({
            severity: 'info',
            summary: $localize`Running feed...`,
            detail: $localize`Please wait a moment, you will be redirected to the feed run page.`,
        });

        await this.feedService
            .runFeed(feed.organization, feed)
            .then(async (run) => {
                await this.router.navigate([
                    'organization',
                    feed.organization,
                    'contents',
                    'feeds',
                    run.feed,
                    'runs',
                    run._id,
                ]);
            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error running feed`,
                });
            });
    }


    onEditFeed(feed: Feed) {
        this.feedService.onFeedSelect(feed);
        this.feedService.showDialog($localize`Edit Feed`, false);
    }

    async onDeleteFeed(feed: Feed) {
        this.confirmationService.confirm({
            key: 'confirm-delete-feed',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.feedService
                    .removeFeed(
                        feed.organization,
                        feed._id,
                    )
                    .then(() => {
                        this.messageService.add({
                            severity: 'success',
                            summary: $localize`Success`,
                            detail: $localize`Feed has been deleted successfully.`,
                        });
                    })
                    .catch((err) => {
                        console.error(err);
                        MessageUtils.parseServerError(
                            this.messageService,
                            err,
                            {
                                summary: $localize`Error deleting feed`,
                            },
                        );
                    });
            },
        });
    }

    static permissions = [CreateFeed, UpdateFeed, ReadFeedRun];
}
