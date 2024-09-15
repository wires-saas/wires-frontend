import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Block, BlockWithHistory, BlockService } from '../../../../services/block.service';
import { editor } from 'monaco-editor';
// @ts-ignore
import history from 'objecthistory'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../../../layout/service/app.layout.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService } from 'primeng/api';
import { zip } from 'rxjs';

@Component({
    selector: 'app-block-editor',
    templateUrl: './block-editor.component.html',
})
export class BlockEditorComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    loadingBlock: boolean = false;

    block: BlockWithHistory | undefined = undefined;

    darkMode: boolean = false;

    constructor(private blockService: BlockService,
                private layoutService: LayoutService,
                private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    ngOnInit() {


        zip(this.activatedRoute.params, this.activatedRoute.data).pipe(
            map(([params, data]) => {
                // trying to fetch block
                if (params['blockId'] && params['slug']) {
                    this.block = undefined;
                    this.loadingBlock = true;
                    this.blockService.getBlock(params['slug'], params['blockId']).then((block) => {
                        console.log('from db', block);
                        this.block = new BlockWithHistory(block);
                        this.loadingBlock = false;
                    }).catch(async (err) => {
                        console.error(err);
                        this.loadingBlock = false;
                        await this.router.navigate(['/block-not-found']);
                    });
                } else {
                    // Creating new block
                    const pureHTML = !!data['pureHTML'];
                    this.block = new BlockWithHistory(this.blockService.getNewBlock(!pureHTML));
                }

            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this.darkMode = !this.layoutService.isLightMode();

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
        this.block?.undo();
        this.cloneBlock();
    }

    redo() {
        this.block?.redo();
        this.cloneBlock();
    }

    openDisplayNameDialog() {
        const nextDisplayName = prompt('Enter new display name');
        if (nextDisplayName) {
            this.block?.setDisplayName(nextDisplayName);
            this.cloneBlock();
        }
    }

    cloneBlock() {
        this.block = this.block?.clone();
    }

    saveBlock() {
        // ...
    }

}
