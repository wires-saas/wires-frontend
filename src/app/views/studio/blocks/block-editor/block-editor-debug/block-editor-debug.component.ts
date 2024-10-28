import { Component, Input } from '@angular/core';
import { Block } from '../../../../../services/block.service';

@Component({
    selector: 'app-block-editor-debug',
    templateUrl: './block-editor-debug.component.html',
})
export class BlockEditorDebugComponent {
    @Input() block!: Block;
    @Input() darkMode!: boolean;
}
