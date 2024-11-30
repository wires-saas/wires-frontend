import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';
import {BlocksListComponent} from "../../../meta-components/blocks-list/blocks-list.component";
import {ButtonDirective} from "primeng/button";
import {EmptyCardComponent} from "../../../meta-components/empty-card/empty-card.component";
import {ExplorerComponent} from "../../../meta-components/explorer/explorer.component";
import {Ripple} from "primeng/ripple";
import {TemplatesListComponent} from "../../../meta-components/templates-list/templates-list.component";
import {TemplateService} from "../../../services/template.service";
import {ConfirmationService, MessageService} from "primeng/api";

@NgModule({
    imports: [CommonModule, TemplatesRoutingModule, BlocksListComponent, ButtonDirective, EmptyCardComponent, ExplorerComponent, Ripple, TemplatesListComponent],
    declarations: [TemplatesComponent],
    providers: [TemplateService, ConfirmationService, MessageService],
})
export class TemplatesModule {}
