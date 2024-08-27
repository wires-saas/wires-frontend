import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../../demo/service/product.service';
import { Article, ArticleService } from '../../../services/article.service';
import { OrganizationService } from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';


@Component({
    templateUrl: './articles.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ArticlesComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    articles: Article[] = [];

    statuses: any[] = [];

    loading: boolean = true;

    constructor(private articleService: ArticleService, private organizationService: OrganizationService) { }


    ngOnInit() {

        this.organizationService.currentOrganization$.pipe(
            map(async (organization) => {

                if (organization) {
                    this.loading = true;
                    this.articles = await this.articleService.getArticles(organization.slug);
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



}
