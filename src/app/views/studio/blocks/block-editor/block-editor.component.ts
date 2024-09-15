import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Block, BlockWithHistory, BlockService } from '../../../../services/block.service';
import { editor } from 'monaco-editor';
// @ts-ignore
import history from 'objecthistory'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../../../layout/service/app.layout.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
import { ConfirmationService } from 'primeng/api';

@Component({
    selector: 'app-block-editor',
    templateUrl: './block-editor.component.html',
})
export class BlockEditorComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    block!: BlockWithHistory;

    darkMode: boolean = false;

    constructor(private blockService: BlockService,
                private layoutService: LayoutService,
                private activatedRoute: ActivatedRoute,
                private confirmationService: ConfirmationService) {
    }

    ngOnInit() {

        this.activatedRoute.data.pipe(
            map((data) => {
                console.log(data);
                const pureHTML = !!data['pureHTML'];
                this.block = new BlockWithHistory(this.blockService.getNewBlock(!pureHTML));
                console.log(this.block);
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this.layoutService.configUpdate$.pipe(
            map((config) => {
                    this.darkMode =
                        config.colorScheme === 'dark' ||
                        config.colorScheme === 'dim';
                },
            ),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    undo() {
        this.block.undo();
    }

    redo() {
        this.block.redo();
    }

    openDisplayNameDialog() {
        const nextDisplayName = prompt('Enter new display name');
        if (nextDisplayName) {
            this.block.setDisplayName(nextDisplayName);
        }
    }

}
