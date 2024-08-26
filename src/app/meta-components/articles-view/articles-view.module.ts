import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { ArticlesViewComponent } from './articles-view.component';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { DataViewModule } from 'primeng/dataview';
import { ArticleCardComponent } from './article-card/article-card.component';
import { TooltipModule } from 'primeng/tooltip';
import { ArticleClickRatePipe } from '../../utils/pipes/article-click-rate.pipe';
import { BadgeModule } from 'primeng/badge';
import { TagModule } from 'primeng/tag';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        RouterModule,
        StyleClassModule,
        AppConfigModule,
        DropdownModule,
        FormsModule,
        DataViewModule,
        TooltipModule,
        ArticleClickRatePipe,
        BadgeModule,
        TagModule,
    ],
    exports: [
        ArticlesViewComponent,
        ArticleCardComponent
    ],
    declarations: [
        ArticlesViewComponent,
        ArticleCardComponent
    ]
})
export class ArticlesViewModule { }
