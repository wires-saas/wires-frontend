import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Article } from '../../services/article.service';

@Component({
    selector: 'app-articles-table',
    templateUrl: './articles-table.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ArticlesTableComponent {

    @Input() articles: Article[] = [];

    @Input() statuses: any[] = [];

    activityValues: number[] = [0, 100];

    @Input() loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;


    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains');
    }

    clear(table: Table) {
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getTagSeverity(index: number) {
        const severities = ['', 'success', 'info', 'warning', 'danger'];

        const safeIndex = index % severities.length;

        return severities[safeIndex];
    }

}
