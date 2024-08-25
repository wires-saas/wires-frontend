import { Pipe, PipeTransform } from '@angular/core';
import { Organization } from '../../services/organization.service';
import { Article } from '../../services/article.service';

@Pipe({
    name: 'clickRate',
    standalone: true,
    pure: true
})
export class ArticleClickRatePipe implements PipeTransform {
    transform(article: Article, fractionDigits: number = 2): string {
        return (article.stats.clicked / article.stats.sent * 100).toFixed(fractionDigits) + '%';
    }
}
