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
        { label: 'Most Sent', value: 'stats.sent' },
        { label: 'Most Displayed', value: 'stats.displayed' },
        { label: 'Most Clicked', value: 'stats.clicked' },
        { label: 'Most Recent', value: 'metadata.publishedAt' }
    ];

    sortField: string = '';

    @Input() allArticles: Article[] = [];
    @Input() newArticles: Array<Article['url']> = [];

    /*
    allArticles: Article[] = [
        {
            _id: '1',
            url: '/article/1',
            metadata: {
                title: 'Blog',
                description: 'Ornare egestas pellentesque facilisis in a ultrices erat diam metus integer sed',
                image: 'assets/demo/images/blog/blog-1.png',
                categories: ['Blog'],
                publishedAt: Date.now(),
            },

            stats: {
                sent: 10,
                displayed: 5,
                clicked: 1,
            },

            tags: ['a', 'b'],
            feeds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),

        },
        {
            _id: '2',
            url: '/article/2',
            metadata: {
                title: 'Magazine',
                description: 'Magna iaculis sagittis, amet faucibus scelerisque non ornare non in penatibus',
                image: 'assets/demo/images/blog/blog-2.png',
                categories: ['Magazine'],
                publishedAt: Date.now(),
            },

            // displays > views > clicks
            stats: {
                sent: 50,
                displayed: 25,
                clicked: 10,
            },

            tags: ['a', 'b'],
            feeds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),

        },
        {
            _id: '3',
            url: '/article/3',
            metadata: {
                title: 'Science',
                description: 'Purus mattis mi, libero maecenas volutpat quis a morbi arcu pharetra, mollis',
                image: 'assets/demo/images/blog/blog-3.png',
                categories: ['Science'],
                publishedAt: Date.now(),
            },

            // displays > views > clicks
            stats: {
                sent: 100,
                displayed: 50,
                clicked: 25,
            },

            tags: ['a', 'b'],
            feeds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),

        },
        {
            _id: '4',
            url: '/article/4',
            metadata: {
                title: 'Blog',
                description: 'Curabitur vitae sit justo facilisi nec, sodales proin aliquet libero volutpat nunc',
                image: 'assets/demo/images/blog/blog-4.png',
                categories: ['Blog'],
                publishedAt: Date.now(),
            },

            // displays > views > clicks
            stats: {
                sent: 200,
                displayed: 100,
                clicked: 50,
            },

            tags: ['a', 'b'],
            feeds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),

        },
        {
            _id: '5',
            url: '/article/5',
            metadata: {
                title: 'Magazine',
                description: 'Id eget arcu suspendisse ullamcorper dolor lobortis dui et morbi penatibus quam',
                image: 'assets/demo/images/blog/blog-5.png',
                categories: ['Magazine'],
                publishedAt: Date.now(),
            },

            stats: {
                sent: 300,
                displayed: 150,
                clicked: 100,
            },

            tags: ['a', 'b'],
            feeds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
        {
            _id: '6',
            url: '/article/6',
            metadata: {
                title: 'Science',
                description: 'Sagittis hendrerit laoreet dignissim sed auctor sit pellentesque vel diam iaculis et',
                image: 'assets/demo/images/blog/blog-6.png',
                categories: ['Science'],
                publishedAt: Date.now(),
            },
            stats: {
                sent: 400,
                displayed: 200,
                clicked: 150,
            },
            tags: ['a', 'b'],
            feeds: [],
            createdAt: Date.now(),
            updatedAt: Date.now(),
        },
    ];
     */
}
