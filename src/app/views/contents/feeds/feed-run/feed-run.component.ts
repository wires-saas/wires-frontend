import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { FeedService } from '../../../../services/feed.service';


@Component({
    selector: 'app-feed-run',
    templateUrl: './feed-run.component.html'
})
export class FeedRunComponent implements OnInit {

    organizationSlug!: string;
    feedId!: string;
    runId!: string;

    feedRun: any;

    constructor(private route: ActivatedRoute, private feedService: FeedService) {
    }


    async ngOnInit() {

        this.organizationSlug = this.route.snapshot.params['slug'];
        this.feedId = this.route.snapshot.params['feedId'];
        this.runId = this.route.snapshot.params['runId'];

        this.feedRun = await this.feedService.getFeedRun(this.organizationSlug, this.feedId, this.runId);
        console.log(this.feedRun);

    }

}
