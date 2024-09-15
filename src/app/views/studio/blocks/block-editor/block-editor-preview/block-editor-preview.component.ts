import { Component, Input, OnInit } from '@angular/core';
import { Block } from '../../../../../services/block.service';

@Component({
    selector: 'app-block-editor-preview',
    templateUrl: './block-editor-preview.component.html',
})
export class BlockEditorPreviewComponent {

    @Input() block!: Block;

}
