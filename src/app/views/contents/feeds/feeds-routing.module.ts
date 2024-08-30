import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeedsComponent } from './feeds.component';
import { FeedRunComponent } from './feed-run/feed-run.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: FeedsComponent },
            { path: ':feedId/runs/:runId', component: FeedRunComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class FeedsRoutingModule {}
