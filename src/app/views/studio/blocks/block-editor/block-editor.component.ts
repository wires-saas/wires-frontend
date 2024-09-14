import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { AbstractBlock, AbstractBlockWithHistory, BlockService } from '../../../../services/block.service';
import { editor } from 'monaco-editor';
// @ts-ignore
import history from 'objecthistory'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../../../layout/service/app.layout.service';
import { map } from 'rxjs/operators';

@Component({
    selector: 'app-block-editor',
    templateUrl: './block-editor.component.html',
})
export class BlockEditorComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    block!: AbstractBlockWithHistory;

    editorOptions = {
        theme: 'vs-dark',
        language: 'html',
        // renderMinimap: RenderMinimap.None
    }

    darkMode: boolean = false;

    constructor(private blockService: BlockService, private layoutService: LayoutService, private _cdr: ChangeDetectorRef) {
        /* const blockHandler = {
            get(target: AbstractBlock, prop: keyof AbstractBlock, receiver: any) {

                if (prop === 'removeParameter') {
                    console.log('getting key', prop, 'from', target[prop]);
                    return function (...args: any[]) {
                        // @ts-ignore
                        console.log('before', this, args);
                        // @ts-ignore
                        Reflect.set(target, 'version', this.version + 1);
                        // @ts-ignore
                        Reflect.apply(target[prop], this, args);
                        console.log('after');
                    };
                }

                return Reflect.get(target, prop, receiver);
            },
            set: (target: AbstractBlock, key: keyof AbstractBlock, value: any) => {
                console.log('setting key', key, 'to', value);
                Object.assign(target, {[key]: value});
                return true;
            },
            apply: (target: any, thisArg: any, argumentsList: any) => {
                console.log('apply', target, thisArg, argumentsList);
                return true;
            },
        }; */
        // this.block = new Proxy(blockService.getBlock(), blockHandler);

        this.block = new AbstractBlockWithHistory(blockService.getBlock());



    }

    ngOnInit() {
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

    removeParameter(key: string) {
        this.block.removeParameter(key);
        // this._cdr.detectChanges();
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
