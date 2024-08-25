import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { Article } from '../../../services/article.service';

@Component({
    selector: 'app-article-card',
    templateUrl: './article-card.component.html',
})
export class ArticleCardComponent {
    @Input() article!: Article;

    constructor(private router: Router) {}

    navigateToDetail(): void {
        this.router.navigateByUrl('/apps/blog/detail');
    }
}
