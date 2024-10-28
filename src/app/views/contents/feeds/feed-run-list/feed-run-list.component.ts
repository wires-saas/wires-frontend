import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeedRun } from '../../../../services/feed.service';

@Component({
    selector: 'app-feed-run-list',
    templateUrl: './feed-run-list.component.html',
})
export class FeedRunListComponent {
    @Input() loading: boolean = true;

    @Input() runs: FeedRun[] = [];

    @Output() runSelect = new EventEmitter<FeedRun>();

    columns: string[] = [
        $localize`Date`,
        $localize`Feed`,
        $localize`Articles`,
        $localize`New Articles`,
        $localize`Duration`,
        $localize`Status`,
    ];

    onRowSelect(run: FeedRun) {
        this.runSelect.emit(run);
    }
}
