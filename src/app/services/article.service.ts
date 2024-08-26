import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { Customer } from '../demo/api/customer';

export interface ArticleMetadata {
    title: string;
    description: string;
    image: string;
    categories: string[];
    publishedAt: number;
}

export interface ArticleStats {
    sent: number;
    displayed: number;
    clicked: number;
}

export interface Article {
    _id: string;
    url: string;

    metadata: ArticleMetadata;

    stats: ArticleStats;

    tags: string[];
    feeds: string[];

    createdAt: number;
    updatedAt: number;
}

export interface DialogConfig {
    visible: boolean;
}

@Injectable()
export class ArticleService {

    private domain: string;

    dialogConfig: DialogConfig = {
        visible: false,
    };

    private articles$$: BehaviorSubject<Article[]> = new BehaviorSubject<Article[]>([]);

    private selectedArticle$$: Subject<Article> = new Subject<Article>();

    private dialogSource$$: BehaviorSubject<DialogConfig> = new BehaviorSubject<DialogConfig>(this.dialogConfig);

    public articles$: Observable<Article[]> = this.articles$$.asObservable();

    selectedArticle$: Observable<Article> = this.selectedArticle$$.asObservable();

    dialogSource$: Observable<DialogConfig> = this.dialogSource$$.asObservable();

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    // TODO pagination
    async fetchArticles(organizationId: string): Promise<Article[]> {
        return firstValueFrom(this.http.get<Article[]>(`${this.domain}/organizations/${organizationId}/articles`))
            .then((articles) => {
                this.articles$$.next(articles);
                return articles;
            });
    }

    onArticleSelect(article: Article) {
        this.selectedArticle$$.next(article);
    }

    showDialog() {
        this.dialogConfig = {
            visible: true,
        };

        this.dialogSource$$.next(this.dialogConfig);
    }

    closeDialog() {
        this.dialogConfig = { visible: false };
        this.dialogSource$$.next(this.dialogConfig);
    }

    async getFakeArticles(): Promise<Article[]> {
        return firstValueFrom(this.http.get<any>('assets/mocks/articles.json'))
            .then(res => res.data as Article[]);
    }

}
