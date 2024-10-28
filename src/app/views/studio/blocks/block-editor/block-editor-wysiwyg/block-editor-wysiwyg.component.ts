import { Component, Input } from '@angular/core';
import { Block } from '../../../../../services/block.service';

@Component({
    selector: 'app-block-editor-wysiwyg',
    templateUrl: './block-editor-wysiwyg.component.html',
})
export class BlockEditorWysiwygComponent {
    @Input() block!: Block;
}
