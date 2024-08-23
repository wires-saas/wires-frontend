import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface Feed {
    id: number;
    name?: string;
    description?: string;
    startDate?: Date;
    endDate?: Date;
    members?: Member[];
    completed?: boolean;
    status?: string;
    comments?: number;
    attachments?: number;
}

export interface Member {
    name?: string;
    image?: string;
}

export interface DialogConfig {
    visible: boolean;
    header?: string;
    newTask?: boolean;
}

@Injectable()
export class FeedService {

    dialogConfig: DialogConfig = {
        visible: false,
        header: '',
        newTask: false
    };

    feeds: Feed[] = [];

    private taskSource = new BehaviorSubject<Feed[]>(this.feeds);

    private selectedTask = new Subject<Feed>();

    private dialogSource = new BehaviorSubject<DialogConfig>(this.dialogConfig);

    taskSource$ = this.taskSource.asObservable();

    selectedTask$ = this.selectedTask.asObservable();

    dialogSource$ = this.dialogSource.asObservable();

    constructor(private http: HttpClient) {
        this.http.get<any>('assets/demo/data/tasks.json')
            .toPromise()
            .then(res => res.data as Feed[])
            .then(data => {
                this.feeds = data;
                this.taskSource.next(data);
            });
    }

    addTask(task: Feed) {
        if (this.feeds.includes(task)) {
            this.feeds = this.feeds.map(t => t.id === task.id ? task : t);
        }
        else {
            this.feeds = [...this.feeds, task];
        }

        this.taskSource.next(this.feeds);
    }

    removeTask(id: number) {
        this.feeds = this.feeds.filter(t => t.id !== id);
        this.taskSource.next(this.feeds);
    }

    onTaskSelect(task: Feed) {
        this.selectedTask.next(task);
    }

    markAsCompleted(task: Feed) {
        this.feeds = this.feeds.map(t => t.id === task.id ? task : t);
        this.taskSource.next(this.feeds);
    }

    showDialog(header: string, newTask: boolean) {
        this.dialogConfig = {
            visible: true,
            header: header,
            newTask: newTask
        };

        this.dialogSource.next(this.dialogConfig);
    }

    closeDialog() {
        this.dialogConfig = {
            visible: false
        }

        this.dialogSource.next(this.dialogConfig);
    }

}
