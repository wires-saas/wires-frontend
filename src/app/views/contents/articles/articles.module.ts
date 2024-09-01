import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ArticlesComponent } from './articles.component';
import { ArticlesRoutingModule } from './articles-routing.module';
import { TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { RippleModule } from 'primeng/ripple';
import { MultiSelectModule } from 'primeng/multiselect';
import { DropdownModule } from 'primeng/dropdown';
import { ProgressBarModule } from 'primeng/progressbar';
import { ToastModule } from 'primeng/toast';
import { SliderModule } from 'primeng/slider';
import { RatingModule } from 'primeng/rating';
import { TooltipModule } from 'primeng/tooltip';
import { ArticlesViewModule } from '../../../meta-components/articles-view/articles-view.module';
import { ArticlesTableModule } from '../../../meta-components/articles-table/articles-table.module';
import { ArticleService } from '../../../services/article.service';
import { FeedService } from '../../../services/feed.service';
import { CreateOrUpdateTagComponent } from './create-or-update-tag/create-or-update-tag.component';
import { InputNumberModule } from 'primeng/inputnumber';
import { ChipsModule } from 'primeng/chips';
import { DialogModule } from 'primeng/dialog';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { TagService } from '../../../services/tag.service';
import { TagRulePipe } from '../../../utils/pipes/tag-rule.pipe';
import { TagRuleComponent } from './tag-rule/tag-rule.component';
import { TagRuleTypePipe } from '../../../utils/pipes/tag-rule-type.pipe';
import { TagRuleOperatorPipe } from '../../../utils/pipes/tag-rule-operator.pipe';

@NgModule({
    imports: [
        CommonModule,
        ArticlesRoutingModule,
        FormsModule,
        TableModule,
        RatingModule,
        ButtonModule,
        InputNumberModule,
        InputTextareaModule,
        SliderModule,
        InputTextModule,
        ToggleButtonModule,
        RippleModule,
        MultiSelectModule,
        DropdownModule,
        ProgressBarModule,
        ToastModule,
        TooltipModule,
        ArticlesViewModule,
        ArticlesTableModule,
        ChipsModule,
        DialogModule,
        TagRulePipe,
        TagRuleTypePipe,
        TagRuleOperatorPipe,
    ],
    declarations: [ArticlesComponent, CreateOrUpdateTagComponent, TagRuleComponent],
    providers: [ArticleService, FeedService, TagService],
})
export class ArticlesModule {}
