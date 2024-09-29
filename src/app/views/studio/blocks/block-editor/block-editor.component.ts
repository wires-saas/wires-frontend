import { ChangeDetectorRef, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Block, BlockWithHistory, BlockService } from '../../../../services/block.service';
import { editor } from 'monaco-editor';
// @ts-ignore
import history from 'objecthistory'
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../../../layout/service/app.layout.service';
import { map } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { zip } from 'rxjs';
import { OrganizationService } from '../../../../services/organization.service';
import { MessageUtils } from '../../../../utils/message.utils';

@Component({
    selector: 'app-block-editor',
    templateUrl: './block-editor.component.html',
})
export class BlockEditorComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    loadingBlock: boolean = false;
    savingBlock: boolean = false;

    block: BlockWithHistory | undefined = undefined;

    darkMode: boolean = false;

    private currentOrgSlug: string | undefined;

    constructor(private blockService: BlockService,
                private layoutService: LayoutService,
                private activatedRoute: ActivatedRoute,
                private organizationService: OrganizationService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private router: Router) {
    }

    ngOnInit() {

        this.organizationService.currentOrganization$.pipe(
            map(async (org) => {
                this.currentOrgSlug = org?.slug;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();


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

    openDescriptionDialog() {
        const nextDescription = prompt('Enter new description');
        if (nextDescription) {
            this.block?.setDescription(nextDescription);
            this.cloneBlock();
        }
    }

    cloneBlock() {
        this.block = this.block?.clone();
    }

    async openDeleteBlockDialog() {

        const onDelete = () => {
            this.blockService.deleteBlock(this.currentOrgSlug!, this.block!._id!).then(() => {
                this.messageService.add({
                    key: 'block-editor',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Block deleted successfully'
                });
                // this.router.navigate(['/studio/blocks']);
            }).catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(
                    this.messageService,
                    err,
                    {
                        summary: $localize`Error deleting block`,
                    },
                );
            });
        }

        this.confirmationService.confirm({
            key: 'confirm-delete',
            accept: onDelete,
        });

    }

    async saveBlock() {
        // ...
        this.savingBlock = true;
        await this.blockService.saveBlock(this.currentOrgSlug!, this.block!)
            .then(() => {
                this.savingBlock = false;
                if (!this.block?._id) {
                    this.messageService.add({
                        key: 'block-editor',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Block created successfully'
                    });
                } else {
                    this.messageService.add({
                        key: 'block-editor',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Block updated successfully'
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                this.savingBlock = false;

                this.messageService.add({key: 'block-editor', severity: 'error', summary: 'Error', detail: 'Failed to save block'});
            });
    }

}
