import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Feed, FeedRun, FeedService } from '../../../../services/feed.service';

@Component({
    selector: 'app-feed-run',
    templateUrl: './feed-run.component.html',
})
export class FeedRunComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    organizationSlug!: string;
    feedId!: string;
    runId!: string;

    feed: Feed | undefined;
    feedRun: FeedRun | undefined;

    get title() {
        return $localize`Run of feed "${this.feed?.displayName}"`;
    }

    constructor(
        private router: Router,
        private route: ActivatedRoute,
        private feedService: FeedService,
    ) {}

    async ngOnInit() {
        this.organizationSlug = this.route.snapshot.params['slug'];
        this.feedId = this.route.snapshot.params['feedId'];
        this.runId = this.route.snapshot.params['runId'];

        this.feed = await this.feedService
            .getFeed(this.organizationSlug, this.feedId)
            .catch((error) => {
                console.error(error);
                this.router.navigateByUrl('/not-found');
                return undefined;
            });

        this.feedRun = await this.feedService
            .getFeedRun(this.organizationSlug, this.feedId, this.runId)
            .catch((error) => {
                console.error(error);
                this.router.navigateByUrl('/not-found');
                return undefined;
            });
    }
}
