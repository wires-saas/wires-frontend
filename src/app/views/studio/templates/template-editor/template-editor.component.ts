import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    Block,
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
import {UpdateTemplate} from '../../../../utils/permission.utils';
import { AuthService } from '../../../../services/auth.service';
import {TemplateService, TemplateWithHistory} from "../../../../services/template.service";
import {BlockLibraryService} from "../../../../services/block-library.service";

@Component({
    selector: 'app-template-editor',
    templateUrl: './template-editor.component.html',
})
export class TemplateEditorComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    loadingTemplate: boolean = false;
    savingTemplate: boolean = false;
    changingIcon: boolean = false;

    template: TemplateWithHistory | undefined = undefined;
    blocks: Block[] = [];
    blocksTotal: number = 0;
    blocksPage: number = 0;
    blocksSize: number = 9;

    iconPickerDialogVisible: boolean = false;


    darkMode: boolean = false;

    actionsMenu: MenuItem[] = [];

    canUpdateTemplate: boolean = false;

    private currentOrgSlug: string | undefined;

    constructor(
        private authService: AuthService,
        private blockService: BlockService,
        private blockLibraryService: BlockLibraryService,
        private templateService: TemplateService,
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
                        this.canUpdateTemplate = await firstValueFrom(
                            this.authService.hasPermission$(
                                UpdateTemplate,
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
                                        'creating template if needed',
                                        params,
                                        data,
                                    );
                                    // trying to fetch template
                                    if (params['templateId'] && params['slug']) {
                                        this.template = undefined;
                                        this.loadingTemplate = true;
                                        this.templateService
                                            .getTemplate(
                                                this.currentOrgSlug!,
                                                params['templateId'],
                                            )
                                            .then((template) => {
                                                console.log('from db', template);
                                                this.template =
                                                    new TemplateWithHistory(template);
                                                this.buildActionsMenu();
                                                this.loadingTemplate = false;
                                            })
                                            .catch(async (err) => {
                                                console.error(err);
                                                this.loadingTemplate = false;
                                                await this.router.navigate([
                                                    '/template-not-found',
                                                ]);
                                            });
                                    } else {
                                        // Creating new template
                                        this.template = new TemplateWithHistory(
                                            this.templateService.getNewTemplate(
                                                this.currentOrgSlug!,
                                            ),
                                        );
                                        this.buildActionsMenu();
                                    }
                                }),
                                take(1),
                            )
                            .subscribe();


                        this.resetBlocksPagination();
                        this.fetchBlocks();
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
        this.template?.undo();
        this.cloneTemplate();
    }

    redo() {
        this.template?.redo();
        this.cloneTemplate();
    }

    private async fetchBlocks() {
        const blocksPaginationResult = await this.blockLibraryService.getBlocks(
            this.currentOrgSlug!,
            this.blocksPage,
            this.blocksSize,
            ''
        );
        this.blocks = blocksPaginationResult.items;
        this.blocksTotal = blocksPaginationResult.total;
    }

    async fetchPreviousBlocks() {
        if (this.blocksPage === 0) return;
        this.blocksPage--;
        await this.fetchBlocks();
    }

    async fetchNextBlocks() {
        if ((this.blocksPage + 1) * this.blocksSize >= this.blocksTotal) return;
        this.blocksPage++;
        await this.fetchBlocks();
    }

    async openBlockEditor(block: Block) {

        await this.router.navigate([
            '/organization',
            this.currentOrgSlug,
            'studio',
            'blocks',
            block.id,
            'editor',
        ]);
    }

    openIconDialog() {
        this.iconPickerDialogVisible = true;
    }

    changeIcon(icon: string) {
        this.changingIcon = true;
        this.iconPickerDialogVisible = false;
        this.template?.setIcon(icon);
        this.cloneTemplate();

        // As the icon is based on SVG, we must wait for the icon to be rendered
        setTimeout(() => this.changingIcon = false, 1);
    }

    openDisplayNameDialog() {
        const nextDisplayName = prompt('Enter new display name');
        if (nextDisplayName) {
            this.template?.setDisplayName(nextDisplayName);
            this.cloneTemplate();
        }
    }

    openDescriptionDialog() {
        const nextDescription = prompt('Enter new description');
        if (nextDescription) {
            this.template?.setDescription(nextDescription);
            this.cloneTemplate();
        }
    }

    private cloneTemplate() {
        this.template = this.template?.clone();
    }

    private resetBlocksPagination() {
        this.blocks = [];
        this.blocksPage = 0;
        this.blocksSize = 9;
        this.blocksTotal = 0;
    }

    async openDeleteTemplateDialog() {
        const onDelete = () => {
            this.templateService
                .deleteTemplate(this.currentOrgSlug!, this.template!.id!)
                .then(() => {
                    this.messageService.add({
                        key: 'template-editor',
                        severity: 'success',
                        summary: $localize`Success`,
                        detail: $localize`Template deleted successfully`,
                    });
                    // this.router.navigate(['/studio/blocks']);
                })
                .catch((err) => {
                    console.error(err);

                    MessageUtils.parseServerError(this.messageService, err, {
                        summary: $localize`Error deleting template`,
                    });
                });
        };

        this.confirmationService.confirm({
            key: 'confirm-delete',
            accept: onDelete,
        });
    }

    async openArchiveTemplateDialog() {
        const onArchive = () => {
            this.templateService
                .archiveTemplate(this.currentOrgSlug!, this.template!.id!)
                .then(() => {
                    this.messageService.add({
                        key: 'template-editor',
                        severity: 'success',
                        summary: $localize`Success`,
                        detail: $localize`Template archived successfully`,
                    });
                    // this.router.navigate(['/studio/blocks']);
                })
                .catch((err) => {
                    console.error(err);

                    MessageUtils.parseServerError(this.messageService, err, {
                        summary: $localize`Error archiving template`,
                    });
                });
        };

        this.confirmationService.confirm({
            key: 'confirm-archive',
            accept: onArchive,
        });
    }

    async saveTemplate() {
        this.savingTemplate = true;

        if (!this.template) throw new Error('Template is not defined');

        const creatingNewTemplate = !this.template.id;
        const save = creatingNewTemplate
            ? this.templateService.createTemplate(this.currentOrgSlug!, this.template)
            : this.templateService.updateTemplate(this.currentOrgSlug!, this.template);

        await save
            .then(() => {
                this.savingTemplate = false;
                if (creatingNewTemplate) {
                    this.messageService.add({
                        key: 'template-editor',
                        severity: 'success',
                        summary: $localize`Success`,
                        detail: $localize`Template created successfully`,
                    });
                } else {
                    this.messageService.add({
                        key: 'template-editor',
                        severity: 'success',
                        summary: $localize`Success`,
                        detail: $localize`Template updated successfully`,
                    });
                }
            })
            .catch((err) => {
                console.error(err);
                this.savingTemplate = false;

                this.messageService.add({
                    key: 'template-editor',
                    severity: 'error',
                    summary: $localize`Error`,
                    detail: $localize`Failed to save template`,
                });
            });
    }

    private buildActionsMenu() {
        this.actionsMenu = [
            {
                label: $localize`Archive`,
                icon: 'pi pi-box',
                visible: this.template && !this.template.isArchived,
                command: () => this.openArchiveTemplateDialog(),
            },
            {
                label: $localize`Delete`,
                icon: 'pi pi-trash',
                command: () => this.openDeleteTemplateDialog(),
            },
        ];
    }
}
