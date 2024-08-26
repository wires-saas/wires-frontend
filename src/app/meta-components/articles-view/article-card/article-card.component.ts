import { ChangeDetectionStrategy, Component, Input, OnInit } from '@angular/core';
import { Article } from '../../../services/article.service';

@Component({
    selector: 'app-article-card',
    templateUrl: './article-card.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ArticleCardComponent implements OnInit {
    @Input() article!: Article;
    @Input() displayNewBadge: boolean = false;

    statsRelevant: boolean = false;

    ngOnInit() {
        this.statsRelevant = this.article.stats.sent > 0 || this.article.stats.displayed > 0 || this.article.stats.clicked > 0;
    }
}
