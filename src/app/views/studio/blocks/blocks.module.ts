import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks.component';
import { BlocksRoutingModule } from './blocks-routing.module';
import { BlockService } from '../../../services/block.service';
import { BlockEditorComponent } from './block-editor/block-editor.component';
import { MonacoEditorModule } from 'ngx-monaco-editor-v2';
import { FormsModule } from '@angular/forms';
import { PrettyJsonPipe } from '../../../utils/pipes/prettyjson.pipe';
import { InputTextModule } from 'primeng/inputtext';
import { PanelModule } from 'primeng/panel';
import { ButtonModule } from 'primeng/button';
import { RippleModule } from 'primeng/ripple';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';
import { BlockEditorDebugComponent } from './block-editor/block-editor-debug/block-editor-debug.component';
import {
    BlockEditorParametersComponent
} from './block-editor/block-editor-parameters/block-editor-parameters.component';
import { BlockEditorCodeComponent } from './block-editor/block-editor-code/block-editor-code.component';
import { BlockEditorPreviewComponent } from './block-editor/block-editor-preview/block-editor-preview.component';
import { BlockEditorWysiwygComponent } from './block-editor/block-editor-wysiwyg/block-editor-wysiwyg.component';
import { SkeletonModule } from 'primeng/skeleton';
import { ExplorerComponent } from '../../../meta-components/explorer/explorer.component';

@NgModule({
    imports: [
        CommonModule,
        BlocksRoutingModule,
        MonacoEditorModule,
        FormsModule,
        PrettyJsonPipe,
        InputTextModule,
        PanelModule,
        ButtonModule,
        RippleModule,
        TooltipModule,
        TagModule,
        ConfirmDialogModule,
        SkeletonModule,
        ExplorerComponent
    ],
    declarations: [
        BlocksComponent,
        BlockEditorComponent,
        BlockEditorDebugComponent,
        BlockEditorParametersComponent,
        BlockEditorCodeComponent,
        BlockEditorPreviewComponent,
        BlockEditorWysiwygComponent
    ],
    providers: [BlockService, ConfirmationService]
})
export class BlocksModule {}
