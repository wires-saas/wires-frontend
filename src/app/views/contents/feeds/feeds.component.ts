import { Component, OnDestroy } from '@angular/core';
import { Feed, FeedService } from './service/feed.service';
import { Subscription } from 'rxjs';

@Component({
    templateUrl: './feeds.component.html'
})
export class FeedsComponent implements OnDestroy {

    subscription: Subscription;

    todo: Feed[] = [];

    completed: Feed[] = [];

    constructor(private taskService: FeedService) {
        this.subscription = this.taskService.taskSource$.subscribe(data => this.categorize(data));
    }

    categorize(tasks: Feed[]) {
        this.todo = tasks.filter(t => t.completed !== true);
        this.completed = tasks.filter(t => t.completed);
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

    showDialog() {
        this.taskService.showDialog('Create Task', true);
    }
}
