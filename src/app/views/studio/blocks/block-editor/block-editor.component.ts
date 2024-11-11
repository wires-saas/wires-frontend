import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    BlockWithHistory,
    BlockService,
} from '../../../../services/block.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { LayoutService } from '../../../../layout/service/app.layout.service';
import { map, take } from 'rxjs/operators';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { firstValueFrom, zip } from 'rxjs';
import { OrganizationService } from '../../../../services/organization.service';
import { MessageUtils } from '../../../../utils/message.utils';
import { UpdateBlock } from '../../../../utils/permission.utils';
import { AuthService } from '../../../../services/auth.service';

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

    actionsMenu: MenuItem[] = [];

    canUpdateBlock: boolean = false;

    private currentOrgSlug: string | undefined;

    constructor(
        private authService: AuthService,
        private blockService: BlockService,
        private layoutService: LayoutService,
        private activatedRoute: ActivatedRoute,
        private organizationService: OrganizationService,
        private messageService: MessageService,
        private confirmationService: ConfirmationService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map(async (org) => {
                    this.currentOrgSlug = org?.slug;

                    if (this.currentOrgSlug) {
                        this.canUpdateBlock = await firstValueFrom(
                            this.authService.hasPermission$(
                                UpdateBlock,
                                this.currentOrgSlug,
                            ),
                        );

                        zip(
                            this.activatedRoute.params,
                            this.activatedRoute.data,
                        )
                            .pipe(
                                map(([params, data]) => {
                                    console.log(
                                        'creating block if needed',
                                        params,
                                        data,
                                    );
                                    // trying to fetch block
                                    if (params['blockId'] && params['slug']) {
                                        this.block = undefined;
                                        this.loadingBlock = true;
                                        this.blockService
                                            .getBlock(
                                                this.currentOrgSlug!,
                                                params['blockId'],
                                            )
                                            .then((block) => {
                                                console.log('from db', block);
                                                this.block =
                                                    new BlockWithHistory(block);
                                                this.buildActionsMenu();
                                                this.loadingBlock = false;
                                            })
                                            .catch(async (err) => {
                                                console.error(err);
                                                this.loadingBlock = false;
                                                await this.router.navigate([
                                                    '/block-not-found',
                                                ]);
                                            });
                                    } else {
                                        // Creating new block
                                        const pureHTML = !!data['pureHTML'];
                                        this.block = new BlockWithHistory(
                                            this.blockService.getNewBlock(
                                                this.currentOrgSlug!,
                                                !pureHTML,
                                            ),
                                        );
                                        this.buildActionsMenu();
                                    }
                                }),
                                take(1),
                            )
                            .subscribe();
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.darkMode = !this.layoutService.isLightMode();

        this.layoutService.configUpdate$
            .pipe(
                map((config) => {
                    this.darkMode =
                        config.colorScheme === 'dark' ||
                        config.colorScheme === 'dim';
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
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
            this.blockService
                .deleteBlock(this.currentOrgSlug!, this.block!.id!)
                .then(() => {
                    this.messageService.add({
                        key: 'block-editor',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Block deleted successfully',
                    });
                    // this.router.navigate(['/studio/blocks']);
                })
                .catch((err) => {
                    console.error(err);

                    MessageUtils.parseServerError(this.messageService, err, {
                        summary: $localize`Error deleting block`,
                    });
                });
        };

        this.confirmationService.confirm({
            key: 'confirm-delete',
            accept: onDelete,
        });
    }

    async openArchiveBlockDialog() {
        const onArchive = () => {
            this.blockService
                .archiveBlock(this.currentOrgSlug!, this.block!.id!)
                .then(() => {
                    this.messageService.add({
                        key: 'block-editor',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Block archived successfully',
                    });
                    // this.router.navigate(['/studio/blocks']);
                })
                .catch((err) => {
                    console.error(err);

                    MessageUtils.parseServerError(this.messageService, err, {
                        summary: $localize`Error archiving block`,
                    });
                });
        };

        this.confirmationService.confirm({
            key: 'confirm-archive',
            accept: onArchive,
        });
    }

    async saveBlock() {
        this.savingBlock = true;

        if (!this.block) throw new Error('Block is not defined');

        const creatingNewBlock = !this.block.id;
        const save = creatingNewBlock
            ? this.blockService.createBlock(this.currentOrgSlug!, this.block)
            : this.blockService.updateBlock(this.currentOrgSlug!, this.block);

        await save
            .then(() => {
                this.savingBlock = false;
                if (creatingNewBlock) {
                    this.messageService.add({
                        key: 'block-editor',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Block created successfully',
                    });
                } else {
                    this.messageService.add({
                        key: 'block-editor',
                        severity: 'success',
                        summary: 'Success',
                        detail: 'Block updated successfully',
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                this.savingBlock = false;

                this.messageService.add({
                    key: 'block-editor',
                    severity: 'error',
                    summary: 'Error',
                    detail: 'Failed to save block',
                });
            });
    }

    private buildActionsMenu() {
        this.actionsMenu = [
            {
                label: $localize`Archive`,
                icon: 'pi pi-box',
                visible: this.block && !this.block.isArchived,
                command: () => this.openArchiveBlockDialog(),
            },
            {
                label: $localize`Delete`,
                icon: 'pi pi-trash',
                command: () => this.openDeleteBlockDialog(),
            },
        ];
    }
}
