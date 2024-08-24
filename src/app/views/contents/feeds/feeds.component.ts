import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Feed, FeedService } from '../../../services/feed.service';
import { ToggleButtonChangeEvent } from 'primeng/togglebutton';
import { OrganizationService } from '../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Slug } from '../../../utils/types.utils';

@Component({
    templateUrl: './feeds.component.html'
})
export class FeedsComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    currentOrgSlug: Slug | undefined;

    feeds: Feed[] = [];

    autoSchedule: boolean = false;

    constructor(private organizationService: OrganizationService, private feedService: FeedService) {
        this.autoSchedule = this.feedService.autoSchedule;
    }

    async ngOnInit() {

        this.feedService.feeds$.pipe(
            map((feeds) => this.feeds = feeds),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this.organizationService.currentOrganization$.pipe(
            map(async (org) => {
                this.currentOrgSlug = org?.slug;
                if (org) await this.feedService.fetchFeeds(org.slug);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

    }

    toggleAutoSchedule(e: ToggleButtonChangeEvent) {
        this.feedService.toggleAutoSchedule(!!e.checked);
    }

    showDialog() {
        this.feedService.showDialog($localize `Create Feed`, true);
    }
}
