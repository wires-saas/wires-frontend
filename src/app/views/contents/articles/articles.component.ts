import { Component, OnInit } from '@angular/core';
import { MessageService, ConfirmationService } from 'primeng/api';
import { ProductService } from '../../../demo/service/product.service';
import { Article, ArticleService } from '../../../services/article.service';


@Component({
    templateUrl: './articles.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ArticlesComponent implements OnInit {

    articles: Article[] = [];

    statuses: any[] = [];

    loading: boolean = true;

    constructor(private articleService: ArticleService, private productService: ProductService) { }


    ngOnInit() {
        setTimeout(() => {
            this.articleService.getFakeArticles().then(articles => {
                this.articles = articles;
                this.loading = false;

                // @ts-ignore
                this.articles.forEach(article => article.date = new Date(article.metadata.publishedAt));
            });
        }, 200);


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
