import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Block } from '../../../../../services/block.service';

@Component({
    selector: 'app-block-editor-parameters',
    templateUrl: './block-editor-parameters.component.html',
})
export class BlockEditorParametersComponent {
    @Input() block!: Block;

    @Output() blockChange = new EventEmitter<void>();

    removeParameter(key: string) {
        this.block.removeParameter(key);
        this.blockChange.emit();
    }
}
