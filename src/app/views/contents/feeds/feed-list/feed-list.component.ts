import { Component, OnInit, Input, ViewChild, ChangeDetectionStrategy } from '@angular/core';
import { MenuItem } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Feed, FeedService } from '../service/feed.service';

@Component({
    selector: 'app-feed-list',
    templateUrl: './feed-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedListComponent implements OnInit {

    @Input() taskList!: Feed[];

    @Input() title!: string;

    @ViewChild('menu') menu!: Menu;

    menuItems: MenuItem[] = [];

    clickedTask!: Feed;

    constructor(private taskService: FeedService) { }

    ngOnInit(): void {
        this.menuItems = [
            { label: 'Edit', icon: 'pi pi-pencil', command: () => this.onEdit() },
            { label: 'Delete', icon: 'pi pi-trash', command: () => this.handleDelete() }
        ];
    }

    parseDate(date: Date) {
        let d = new Date(date);
        return d.toUTCString().split(' ').slice(1, 3).join(' ');
    }

    handleDelete() {
        this.taskService.removeTask(this.clickedTask.id);
    }

    toggleMenu(event: Event, task: Feed) {
        this.clickedTask = task;
        this.menu.toggle(event);
    }

    onEdit() {
        this.taskService.onTaskSelect(this.clickedTask);
        this.taskService.showDialog('Edit Task', false);
    }

    onCheckboxChange(event: any, task: Feed) {
        event.originalEvent.stopPropagation();
        task.completed = event.checked;
        this.taskService.markAsCompleted(task);
    }
}
