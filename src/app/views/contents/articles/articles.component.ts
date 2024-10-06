import {
    Component,
    DestroyRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { Article, ArticleService } from '../../../services/article.service';
import { OrganizationService } from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Feed, FeedService } from '../../../services/feed.service';
import { ArticlesTableComponent } from '../../../meta-components/articles-table/articles-table.component';
import { firstValueFrom } from 'rxjs';
import { Tag, TagService } from '../../../services/tag.service';
import { TableFilterUtils } from '../../../utils/table.utils';
import { ReadArticle } from '../../../utils/permission.utils';

export interface TagDialogConfig {
    visible: boolean;
    header: string;
    newTag: boolean;
    tag: Tag;
}

@Component({
    templateUrl: './articles.component.html',
    providers: [MessageService, ConfirmationService],
})
export class ArticlesComponent implements OnInit {
    @ViewChild('table') table!: ArticlesTableComponent;

    private destroyRef = inject(DestroyRef);

    organizationSlug!: string;

    feeds: Feed[] = [];

    articles: Article[] = [];

    tags: Tag[] = [];

    categories: string[] = [];

    loading: boolean = true;

    createOrUpdateTagDialog: TagDialogConfig = {
        visible: false,
        header: '',
        newTag: false,
        tag: {} as Tag,
    };

    constructor(
        private articleService: ArticleService,
        private feedService: FeedService,
        private organizationService: OrganizationService,
        private tagService: TagService,
    ) {}

    ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map(async (organization) => {
                    if (organization) {
                        this.organizationSlug = organization.slug;
                        this.loading = true;

                        this.feeds = await this.feedService.getFeeds(
                            organization.slug,
                        );

                        this.tags = await this.tagService.getTags(organization.slug);

                        this.articles = await this.articleService
                            .getArticles(organization.slug)
                            .then((articles) => {
                                return articles.map((article) => {
                                    return {
                                        ...article,
                                        feeds: article.feeds
                                            .map(
                                                (feedId) =>
                                                    this.feeds.find(
                                                        (_) => _._id === feedId,
                                                    )?.displayName,
                                            )
                                            .filter(
                                                (feed) => !!feed,
                                            ) as string[],
                                    };
                                });
                            });

                        const articlesWithCategories = this.articles.filter(
                            (article) => article.metadata.categories.length,
                        );
                        const categories = articlesWithCategories
                            .map((article) => article.metadata.categories)
                            .flat();
                        this.categories = [...new Set(categories)];

                        this.loading = false;
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    async openCreateTagDialog() {
        const filtersFromFrontend = this.table.getFilters();
        const filtersForBackend = TableFilterUtils.convertFiltersToTagRules(filtersFromFrontend);

        const organization = await firstValueFrom(this.organizationService.currentOrganization$);

        if (!organization) throw new Error('Organization not found');

        const tag: Tag = {
            organization: organization.slug,
            displayName: '',
            color: undefined,
            description: '',
            ruleset: filtersForBackend,
        };

        this.createOrUpdateTagDialog = {
            visible: true,
            header: $localize `Create Article Tag`,
            newTag: true,
            tag: tag,
        };

        // TODO eliminate some filters (tags)
        // TODO pretty display filters part of created tag
    }

    closeCreateTagDialog() {
        this.createOrUpdateTagDialog = {
            visible: false,
            header: '',
            newTag: false,
            tag: {} as Tag,
        };
    }

    async handleTagDeletion() {
        this.tags = await this.tagService.getTags(this.organizationSlug);
        this.articles = await this.articleService.getArticles(this.organizationSlug);
    }

    static permissions = [ReadArticle];
}
