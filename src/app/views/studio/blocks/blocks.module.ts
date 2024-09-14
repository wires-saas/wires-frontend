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

@NgModule({
    imports: [CommonModule, BlocksRoutingModule, MonacoEditorModule, FormsModule, PrettyJsonPipe, InputTextModule, PanelModule, ButtonModule, RippleModule, TooltipModule],
    declarations: [BlocksComponent, BlockEditorComponent],
    providers: [BlockService]
})
export class BlocksModule {}
