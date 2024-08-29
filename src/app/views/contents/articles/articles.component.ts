import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../../demo/service/product.service';
import { Article, ArticleService } from '../../../services/article.service';
import { OrganizationService } from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Feed, FeedService } from '../../../services/feed.service';
import { ArticlesTableComponent } from '../../../meta-components/articles-table/articles-table.component';


@Component({
    templateUrl: './articles.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ArticlesComponent implements OnInit {

    @ViewChild('table') table!: ArticlesTableComponent;

    private destroyRef = inject(DestroyRef);

    feeds: Feed[] = [];

    articles: Article[] = [];

    categories: string[] = [];

    statuses: any[] = [];

    loading: boolean = true;

    constructor(private articleService: ArticleService,
                private feedService: FeedService,
                private organizationService: OrganizationService) { }


    ngOnInit() {

        this.organizationService.currentOrganization$.pipe(
            map(async (organization) => {

                if (organization) {
                    this.loading = true;

                    this.feeds = await this.feedService.getFeeds(organization.slug);
                    this.articles = await this.articleService.getArticles(organization.slug).then((articles) => {
                        return articles.map((article) => {
                            return {
                                ...article,
                                feeds: article.feeds
                                    .map((feedId) => this.feeds.find(_ => _._id === feedId)?.displayName)
                                    .filter((feed) => !!feed) as string[]
                            };
                        });
                    });

                    const articlesWithCategories = this.articles.filter((article) => article.metadata.categories.length);
                    const categories = articlesWithCategories.map((article) => article.metadata.categories).flat();
                    this.categories = [...new Set(categories)];

                    this.loading = false;
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();


        this.statuses = [
            { label: 'Unqualified', value: 'unqualified' },
            { label: 'Qualified', value: 'qualified' },
            { label: 'New', value: 'new' },
            { label: 'Negotiation', value: 'negotiation' },
            { label: 'Renewal', value: 'renewal' },
            { label: 'Proposal', value: 'proposal' }
        ];
    }

    openCreateTagDialog() {
        console.log('Create article tag', this.table.getFilters());
        // TODO eliminate some filters (tags)
        // TODO open dialog
        // TODO pretty display filters part of created tag
    }


    static permissions = ['read_article'];
}
