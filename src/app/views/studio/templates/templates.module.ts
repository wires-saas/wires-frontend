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
import {TemplateEditorComponent} from "./template-editor/template-editor.component";
import {SkeletonModule} from "primeng/skeleton";
import {EmptyTemplateDisplayNamePipe} from "../../../utils/pipes/empty-template-display-name.pipe";
import {EmptyTemplateDescriptionPipe} from "../../../utils/pipes/empty-template-description.pipe";
import {MenuModule} from "primeng/menu";
import {ConfirmDialogModule} from "primeng/confirmdialog";
import {ToastModule} from "primeng/toast";
import {PrettyJsonPipe} from "../../../utils/pipes/prettyjson.pipe";
import {BlockService} from "../../../services/block.service";
import {TemplateEditorDebugComponent} from "./template-editor/template-editor-debug/template-editor-debug.component";
import {TagModule} from "primeng/tag";
import {
    TemplateEditorBlocksLibraryComponent
} from "./template-editor/template-editor-blocks-library/template-editor-blocks-library.component";
import {ArraySortPipe} from "../../../utils/pipes/array-sort.pipe";
import {BlockRowCardComponent} from "../../../meta-components/blocks-list/block-row-card/block-row-card.component";
import {InputTextModule} from "primeng/inputtext";
import {ProgressSpinnerModule} from "primeng/progressspinner";
import {
    BlockSquareCardComponent
} from "../../../meta-components/blocks-list/block-square-card/block-square-card.component";
import {
    StaticSquareCardComponent
} from "../../../meta-components/blocks-list/static-square-card/static-square-card.component";
import {BlockLibraryService} from "../../../services/block-library.service";

@NgModule({
    imports: [
        CommonModule,
        TemplatesRoutingModule,
        BlocksListComponent,
        ButtonDirective,
        EmptyCardComponent,
        ExplorerComponent,
        Ripple,
        TemplatesListComponent,
        SkeletonModule,
        EmptyTemplateDisplayNamePipe,
        EmptyTemplateDescriptionPipe,
        MenuModule,
        ConfirmDialogModule,
        ToastModule,
        PrettyJsonPipe,
        TagModule,
        ArraySortPipe,
        BlockRowCardComponent,
        BlockSquareCardComponent,
        InputTextModule,
        ProgressSpinnerModule,
        BlockSquareCardComponent,
        BlockSquareCardComponent,
        BlockSquareCardComponent,
        StaticSquareCardComponent
    ],
    declarations: [
        TemplatesComponent,
        TemplateEditorComponent,
        TemplateEditorDebugComponent,
        TemplateEditorBlocksLibraryComponent
    ],
    providers: [
        TemplateService,
        BlockService,
        BlockLibraryService,
        ConfirmationService,
        MessageService
    ],
})
export class TemplatesModule {}
