import { Component, Input } from '@angular/core';
import { Block } from '../../../../../services/block.service';

@Component({
    selector: 'app-block-editor-parameters',
    templateUrl: './block-editor-parameters.component.html',
})
export class BlockEditorParametersComponent {

    @Input() block!: Block;

    removeParameter(key: string) {
        this.block.removeParameter(key);
    }


}
