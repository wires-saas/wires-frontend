import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'articles',
            data: { breadcrumb: $localize `Articles` },
            loadChildren: () => import('./articles/articles.module').then(m => m.ArticlesModule)
        },
        {
            path: 'feeds',
            data: { breadcrumb: $localize `Feeds` },
            loadChildren: () => import('./feeds/feeds.module').then(m => m.FeedsModule)
        },
    ])],
    exports: [RouterModule]
})
export class ContentsRoutingModule { }
