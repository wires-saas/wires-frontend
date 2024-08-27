import { Component, ElementRef, Input, ViewChild } from '@angular/core';
import { ConfirmationService, FilterService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Article } from '../../services/article.service';
import { Feed } from '../../services/feed.service';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { TableUtils } from '../../utils/table.utils';

@Component({
    selector: 'app-articles-table',
    templateUrl: './articles-table.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ArticlesTableComponent {

    @Input() articles: Article[] = [];

    @Input() statuses: any[] = [];
    @Input() feeds: Feed[] = [];

    textMatchModeOptions: any[] = TableUtils.matchModesOptionsForText();
    urlMatchModeOptions: any[] = TableUtils.matchModesOptionsForUrl();

    // activityValues: number[] = [0, 100];

    @Input() loading: boolean = true;

    @ViewChild('filter') filter!: ElementRef;

    constructor(private filterService: FilterService) {

        // [matchModeOptions]="[{ value: 'hasFeed', label: 'Has Feed' }]"

        // TODO get matchModeOptions factorized, within table.utils.ts

        this.filterService.register('hasFeed', (value: string[], filter: string[]): boolean => {
            console.log(value, filter);
            if (filter === undefined || filter === null || !filter.length) {
                return true;
            }

            if (value === undefined || value === null) {
                return false;
            }

            return filter.every((f) => value.includes(f));
        });

        console.log(this.filterService.filters);

        // this.filterService.filters['isPrimeNumber'](3);
    }


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

    onFilterFeed(feed: DropdownChangeEvent, filter: any) {

        filter(feed.value);

        console.log(filter);
        console.log(feed);
    }

}
