import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    Feed,
    FeedRun,
    FeedRunPopulated,
    FeedService,
} from '../../../services/feed.service';
import { ToggleButtonChangeEvent } from 'primeng/togglebutton';
import { OrganizationService } from '../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Slug } from '../../../utils/types.utils';
import { ActivatedRoute, Router } from '@angular/router';
import { CreateFeed, ReadFeedRun, UpdateFeed } from '../../../utils/permission.utils';

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

    constructor(
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

    static permissions = [CreateFeed, UpdateFeed, ReadFeedRun];
}
