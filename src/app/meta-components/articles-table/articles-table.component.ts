import { Component, ElementRef, EventEmitter, Input, Output, ViewChild } from '@angular/core';
import { ConfirmationService, FilterMetadata, FilterService, MessageService } from 'primeng/api';
import { Table } from 'primeng/table';
import { Article } from '../../services/article.service';
import { Feed } from '../../services/feed.service';
import { DropdownChangeEvent } from 'primeng/dropdown';
import { TableFilterUtils, TableUtils } from '../../utils/table.utils';
import { deepClone } from '../../utils/deep-clone';

@Component({
    selector: 'app-articles-table',
    templateUrl: './articles-table.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ArticlesTableComponent {

    @ViewChild('dt1') table!: Table;

    @Input() articles: Article[] = [];

    @Input() categories: string[] = [];

    @Input() statuses: any[] = [];
    @Input() feeds: Feed[] = [];

    textMatchModeOptions: any[] = TableUtils.matchModesOptionsForText();
    urlMatchModeOptions: any[] = TableUtils.matchModesOptionsForUrl();
    exactMatchModeOptions: any[] = TableUtils.matchModesOptionsExact();

    // activityValues: number[] = [0, 100];

    @Input() loading: boolean = true;

    @Output() onCreateTag: EventEmitter<void> = new EventEmitter<void>();

    @ViewChild('filter') filter!: ElementRef;

    constructor(private filterService: FilterService) {

        // [matchModeOptions]="[{ value: 'hasFeed', label: 'Has Feed' }]"

        // TODO get matchModeOptions factorized, within table.utils.ts

        this.filterService.register('hasFeed', TableFilterUtils.hasFeed);

        this.filterService.register('dateIs', TableFilterUtils.dateIs);

        this.filterService.register('dateIsNot', TableFilterUtils.dateIsNot);

        this.filterService.register('dateBefore', TableFilterUtils.dateBefore);

        this.filterService.register('dateAfter', TableFilterUtils.dateAfter);



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

    getFilters() {
        let filters:  {[p: string]: FilterMetadata[]} = deepClone(this.table.filters);

        filters = Object.entries(filters).reduce((acc, [filterTarget, filterMetadata]) => {

            const relevantFilterMetadata = filterMetadata.filter((metadata) => !!metadata.value);

            if (!relevantFilterMetadata.length) return acc;
            else {
                acc[filterTarget] = filterMetadata.filter((metadata) => !!metadata.value);
                return acc;
            }
        }, {} as {[p: string]: FilterMetadata[]});

        return filters;
    }

    logFilters() {
        console.log(this.table.filters);
    }

}
