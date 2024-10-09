import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { Block } from '../../../../../services/block.service';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-block-editor-code',
    templateUrl: './block-editor-code.component.html',
})
export class BlockEditorCodeComponent implements OnInit {

    @Input() block!: Block;

    @Output() blockChange = new EventEmitter<void>();

    editorOptions = {
        theme: 'vs-dark',
        language: 'html',
        readOnly: true,
    };

    @Input() readonly: boolean = false;

    constructor(private confirmationService: ConfirmationService) {}

    ngOnInit() {

        // if component is forced to be readonly
        if (this.readonly) {
            this.editorOptions = {
                ...this.editorOptions,
                readOnly: true,
            };
        } else {

            // else depends on block behavior
            if (this.block.wysiwygEnabled) {
                this.editorOptions = {
                    ...this.editorOptions,
                    readOnly: true,
                };
            } else {
                this.editorOptions = {
                    ...this.editorOptions,
                    readOnly: false,
                };
            }

        }

    }

    editorChange(e: any) {
        this.block.setCode(e);
    }

    openSwitchHTMLDialog() {
        this.confirmationService.confirm({
            key: 'convertBlock',
            accept: () => {
                this.block.convertToPureHTML();
                this.editorOptions = {
                    ...this.editorOptions,
                    readOnly: false,
                };
                this.blockChange.emit();
            }
        });
    }


}
