import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges} from '@angular/core';
import {Template} from "../../../../../services/template.service";
import {Block} from "../../../../../services/block.service";

@Component({
    selector: 'app-template-editor-blocks-library',
    templateUrl: './template-editor-blocks-library.component.html',
})
export class TemplateEditorBlocksLibraryComponent implements OnChanges {
    @Input() blocks!: Block[];
    @Input() loadingBlocks: boolean = true;
    @Output() fetchNextBlocks: EventEmitter<void> = new EventEmitter<void>();

    ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            this.blocks = changes['blocks'].currentValue;
        }
        console.log(this.blocks);
    }
}
