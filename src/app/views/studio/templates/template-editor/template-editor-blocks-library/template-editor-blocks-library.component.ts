import {Component, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild} from '@angular/core';
import {Block} from "../../../../../services/block.service";
import {Menu} from "primeng/menu";
import {MenuItem} from "primeng/api";

@Component({
    selector: 'app-template-editor-blocks-library',
    templateUrl: './template-editor-blocks-library.component.html',
})
export class TemplateEditorBlocksLibraryComponent implements OnChanges {
    @Input() blocks!: Block[];
    @Input() loadingBlocks: boolean = true;
    @Input() canFetchNextBlocks: boolean = false;
    @Input() canFetchPreviousBlocks: boolean = false;

    @Output() fetchPreviousBlocks: EventEmitter<void> = new EventEmitter<void>();
    @Output() fetchNextBlocks: EventEmitter<void> = new EventEmitter<void>();

    @Output() editBlock = new EventEmitter<Block>();

    @ViewChild('menu') menu!: Menu;
    blockMenu: MenuItem[] = [];

    ngOnChanges(changes: SimpleChanges) {
        if (changes) {
            this.blocks = changes['blocks'].currentValue;
        }
        console.log(this.blocks);
    }

    showBlockContextualMenu(event: any, block: Block) {
        this.buildBlockMenu(block);

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.menu.toggle(event);
    }

    private buildBlockMenu(block: Block): void {
        this.blockMenu = [
            {
                label: $localize`Edit Block`,
                icon: 'fa-regular fa-edit',
                command: async () => {
                    this.editBlock.emit(block);
                },
            },
        ];
    }
}
