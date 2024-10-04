import {
    Component,
    ElementRef,
    EventEmitter,
    Input,
    Output,
    ViewChild,
} from '@angular/core';
import {
    ConfirmationService,
    FilterMetadata,
    FilterService,
    MessageService,
} from 'primeng/api';
import { Table } from 'primeng/table';
import { Article } from '../../services/article.service';
import { Feed } from '../../services/feed.service';
import { TableFilterUtils, TableUtils } from '../../utils/table.utils';
import { deepClone } from '../../utils/deep-clone';
import { Tag, TagService } from '../../services/tag.service';

@Component({
    selector: 'app-articles-table',
    templateUrl: './articles-table.component.html',
    providers: [MessageService, ConfirmationService],
})
export class ArticlesTableComponent {
    @ViewChild('dataTable') table!: Table;

    @Input() articles: Article[] = [];

    @Input() categories: string[] = [];

    @Input() feeds: Feed[] = [];
    @Input() tags: Tag[] = [];

    selectedTag: Tag | undefined = undefined;

    textMatchModeOptions: any[] = TableUtils.matchModesOptionsForText();
    urlMatchModeOptions: any[] = TableUtils.matchModesOptionsForUrl();
    exactMatchModeOptions: any[] = TableUtils.matchModesOptionsExact();

    // activityValues: number[] = [0, 100];

    @Input() loading: boolean = true;

    @Output() onCreateTag: EventEmitter<void> = new EventEmitter<void>();
    @Output() onDeleteTag: EventEmitter<Tag> = new EventEmitter<Tag>();

    @ViewChild('filter') filter!: ElementRef;

    constructor(private filterService: FilterService,
                private messageService: MessageService,
                private tagService: TagService,
                private confirmationService: ConfirmationService) {
        // [matchModeOptions]="[{ value: 'hasFeed', label: 'Has Feed' }]"

        // TODO get matchModeOptions factorized, within table.utils.ts

        this.filterService.register('dateIs', TableFilterUtils.dateIs);

        this.filterService.register('dateIsNot', TableFilterUtils.dateIsNot);

        this.filterService.register('dateBefore', TableFilterUtils.dateBefore);

        this.filterService.register('dateAfter', TableFilterUtils.dateAfter);

        // this.filterService.filters['isPrimeNumber'](3);
    }



    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains',
        );
    }

    clear(table: Table) {
        this.selectedTag = undefined;
        table.clear();
        this.filter.nativeElement.value = '';
    }

    getTagDisplayName(tagId: string) {
        const tag = this.tags.find((tag) => tag._id === tagId);
        return tag ? tag.displayName : 'Unknown tag';
    }

    getTagSeverity(tagId: string) {
        return this.tags.find((tag) => tag._id === tagId)?.color;
    }

    getFilters() {
        let filters: { [p: string]: FilterMetadata[] } = deepClone(
            this.table.filters,
        );

        filters = Object.entries(filters).reduce(
            (acc, [filterTarget, filterMetadata]) => {
                const relevantFilterMetadata = filterMetadata.filter(
                    (metadata) => !!metadata.value,
                );

                if (!relevantFilterMetadata.length) return acc;
                else {
                    acc[filterTarget] = filterMetadata.filter(
                        (metadata) => !!metadata.value,
                    );
                    return acc;
                }
            },
            {} as { [p: string]: FilterMetadata[] },
        );

        return filters;
    }

    loadTagById(tagId: string) {
        const tag = this.tags.find((tag) => tag._id === tagId);
        if (tag) {
            this.loadTag(tag);
        } else {
            this.messageService.add({
                severity: 'error',
                summary: 'Tag not found',
                detail: `Tag with id "${tagId}" not found`,
            });
        }
    }

    loadTag(tag: Tag) {

        this.selectedTag = tag;

        const filters = TableFilterUtils.convertTagRulesToFilters(tag.ruleset);

        // Apply table filters
        // this.table.filter('place', 'metadata.title', 'contains');


        Object.entries(filters).forEach(([field, filterMetadata]) => {
            if (filterMetadata.length > 0) {
                this.table.filters[field] = filterMetadata.map((metadata) => ({
                    value: metadata.value,
                    matchMode: metadata.matchMode,
                    operator: metadata.operator,
                }));
            }
        });

        this.table['_filter']();

        /*
        this.messageService.add({
            severity: 'info',
            summary: 'Tag loaded',
            detail: `Tag "${tag.displayName}" has been loaded`,
        }); */

    }

    async openDeleteTagDialog(tag: Tag, e: Event) {

        this.confirmationService.confirm({
            key: 'confirmTagDeletion',
            target: e.target || new EventTarget(),
            message: 'Are you sure that you want to proceed?',
            icon: 'pi pi-exclamation-triangle',
            acceptButtonStyleClass: 'p-button-danger',
            accept: async () => {

                if (!tag._id) throw new Error('Tag id not found');
                await this.tagService.deleteTag(tag.organization, tag._id);

                this.clear(this.table);

                this.onDeleteTag.emit(tag);

                this.messageService.add({
                    severity: 'success',
                    summary: 'Tag Deleted',
                    detail: `You have successfully deleted tag "${tag.displayName}"`,
                });
            },
        });
    }
}
