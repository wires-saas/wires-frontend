import { Component, Input } from '@angular/core';
import { SelectItem } from 'primeng/api';
import { Blog } from '../../demo/api/blog';
import { Article } from '../../services/article.service';

@Component({
    selector: 'app-articles-view',
    templateUrl: './articles-view.component.html',
})
export class ArticlesViewComponent {

    @Input() articlesPerPage: number = 6;

    sortOptions: SelectItem[] = [
        {label: $localize`Most Recent`, value: 'metadata.publishedAt'},
        {label: $localize`Most Sent`, value: 'stats.sent'},
        {label: $localize`Most Displayed`, value: 'stats.displayed'},
        {label: $localize`Most Clicked`, value: 'stats.clicked'},
    ];

    sortField: string = '';

    @Input() allArticles: Article[] = [];
    @Input() newArticles: Array<Article['url']> = [];
}
