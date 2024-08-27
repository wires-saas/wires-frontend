import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FeedRun } from '../../../../services/feed.service';

@Component({
    selector: 'app-feed-run-list',
    templateUrl: './feed-run-list.component.html'
})
export class FeedRunListComponent {

    @Input() loading: boolean = true;

    @Input() runs: FeedRun[] = [];

    @Output() runSelect = new EventEmitter<FeedRun>();

    onRowSelect(run: FeedRun) {
        this.runSelect.emit(run);
    }

}
