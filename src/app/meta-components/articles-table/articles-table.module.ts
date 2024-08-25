import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { ArticleClickRatePipe } from '../../utils/pipes/article-click-rate.pipe';
import { ArticlesTableComponent } from './articles-table.component';
import { ArticlesRoutingModule } from '../../views/contents/articles/articles-routing.module';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { SliderModule } from 'primeng/slider';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';

@NgModule({
    imports: [
        CommonModule,
        ArticlesRoutingModule,
        FormsModule,
        TableModule,
        RatingModule,
        ButtonModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        TooltipModule,
        ArticleClickRatePipe,
    ],
    exports: [
        ArticlesTableComponent,
    ],
    declarations: [
        ArticlesTableComponent,
    ]
})
export class ArticlesTableModule { }
