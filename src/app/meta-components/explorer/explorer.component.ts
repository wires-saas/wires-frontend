import {
    Component,
    DestroyRef,
    EventEmitter,
    inject,
    Inject,
    Input,
    OnInit,
    Output,
    ViewChild,
} from '@angular/core';
import {
    ConfirmationService,
    MenuItem,
    MenuItemCommandEvent,
    MessageService,
} from 'primeng/api';
import { PanelMenu, PanelMenuModule } from 'primeng/panelmenu';
import { RippleModule } from 'primeng/ripple';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { Folder, FolderService } from '../../services/folder.service';
import { FolderUtils } from '../../utils/folder.utils';
import { OrganizationService } from '../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Slug } from '../../utils/types.utils';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { ReactiveFormsModule } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ExplorerEditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ExplorerCreateDialogComponent } from './create-dialog/create-dialog.component';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { MessageUtils } from '../../utils/message.utils';
import { ToastModule } from 'primeng/toast';
import { firstValueFrom } from 'rxjs';
import {
    CreateFolder,
    DeleteFolder,
    UpdateFolder,
} from '../../utils/permission.utils';
import { AuthService } from '../../services/auth.service';

@Component({
    selector: 'app-explorer',
    templateUrl: './explorer.component.html',
    standalone: true,
    imports: [
        PanelMenuModule,
        RippleModule,
        NgIf,
        ButtonModule,
        MenuModule,
        ContextMenuModule,
        DialogModule,
        InputTextModule,
        ReactiveFormsModule,
        MessageModule,
        ExplorerEditDialogComponent,
        ExplorerCreateDialogComponent,
        ConfirmDialogModule,
        ToastModule,
    ],
})
export class ExplorerComponent implements OnInit {
    @Inject(DestroyRef) private destroyRef: DestroyRef = inject(DestroyRef);

    @ViewChild('menu') menu!: Menu;
    @ViewChild('panel') panel!: PanelMenu;
    @Input() items: MenuItem[] = [];

    @Input() allIcon: string = 'pi pi-home';
    @Input() folderIcon: string = 'pi pi-folder';
    @Input() itemIcon: string = 'pi-file';

    @Input() folderMenu: MenuItem[] = [];

    @Output() selectFolder: EventEmitter<Folder['id'] | null> =
        new EventEmitter<Folder['id'] | null>();
    @Output() removeFolder: EventEmitter<Folder['id'] | null> =
        new EventEmitter<Folder['id'] | null>();

    createFolderDialogVisible: boolean = false;

    editFolderDialogVisible: boolean = false;

    selectedFolder: Folder | undefined;

    canCreateFolder: boolean = false;
    canUpdateFolder: boolean = false;
    canDeleteFolder: boolean = false;

    currentOrgSlug: Slug | undefined;

    constructor(
        private authService: AuthService,
        private organizationService: OrganizationService,
        private folderService: FolderService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
    ) {}

    async ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map(async (organization) => {
                    this.currentOrgSlug = organization?.slug;
                    if (organization) {
                        this.canCreateFolder = await firstValueFrom(
                            this.authService.hasPermission$(
                                CreateFolder,
                                organization.slug,
                            ),
                        );

                        this.canUpdateFolder = await firstValueFrom(
                            this.authService.hasPermission$(
                                UpdateFolder,
                                organization.slug,
                            ),
                        );

                        this.canDeleteFolder = await firstValueFrom(
                            this.authService.hasPermission$(
                                DeleteFolder,
                                organization.slug,
                            ),
                        );

                        await this.loadFoldersAndCreateMenu(organization.slug);
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.folderMenu = [];

        this.toggleAll();
    }

    private async loadFoldersAndCreateMenu(organizationSlug: Slug) {
        this.items = [
            {
                label: $localize`All`,
                icon: this.allIcon,
            },
        ];

        const folders = await this.folderService.getFolders(organizationSlug);

        // Dynamic instantiation of the menu items
        this.items = FolderUtils.foldersToMenuItems(null, folders);

        this.items = [
            {
                label: $localize`All`,
                icon: this.allIcon,
            },
            ...this.items,
        ];

        this.toggleAll();
    }

    private areAllItemsExpanded(): boolean {
        return this.items.every((menuItem) => menuItem.expanded);
    }

    private toggleAll() {
        const expanded = !this.areAllItemsExpanded();
        this.items = this.toggleAllRecursive(this.items, expanded);
    }

    private toggleAllRecursive(
        items: MenuItem[],
        expanded: boolean,
    ): MenuItem[] {
        return items.map((menuItem) => {
            menuItem.expanded = expanded;
            if (menuItem.items) {
                menuItem.items = this.toggleAllRecursive(
                    menuItem.items,
                    expanded,
                );
            }
            return menuItem;
        });
    }

    private buildFolderMenu(folder: MenuItem): void {
        this.folderMenu = [
            {
                label: $localize`Edit`,
                icon: 'pi pi-pencil',
                visible: this.canUpdateFolder,
                command: async () => {
                    if (!this.currentOrgSlug)
                        throw new Error('Organization slug is not set');
                    if (!folder.id) throw new Error('Folder id is not set');

                    this.selectedFolder = folder['data'];
                    this.editFolderDialogVisible = true;
                    // TODO handle backdrop/cross click
                },
            },
            {
                label: $localize`Delete`,
                icon: 'pi pi-fw pi-trash',
                visible: this.canDeleteFolder,
                command: async () => {
                    if (!this.currentOrgSlug)
                        throw new Error('Organization slug is not set');
                    if (!folder.id) throw new Error('Folder id is not set');

                    this.selectedFolder = folder['data'];

                    await this.deleteFolder(this.currentOrgSlug, folder.id);
                },
            },
            {
                label: $localize`Add Folder`,
                icon: 'pi pi-fw pi-plus',
                visible: this.canCreateFolder,
                command: async () => {
                    if (!this.currentOrgSlug)
                        throw new Error('Organization slug is not set');
                    if (!folder.id) throw new Error('Folder id is not set');

                    this.selectedFolder = folder['data'];
                    this.createFolderDialogVisible = true;
                },
            },
            {
                label: $localize`Move to`,
                icon: 'pi pi-fw pi-arrows-alt',
                visible: this.canUpdateFolder,
                items: [
                    {
                        label: $localize`Root`,
                        items: undefined,
                        visible: folder['data'].parentFolder !== null,
                        command: async (event: MenuItemCommandEvent) => {
                            if (!this.currentOrgSlug)
                                throw new Error('Organization slug is not set');
                            if (!folder.id)
                                throw new Error('Folder id is not set');
                            console.log(event);
                            await this.moveFolder(
                                this.currentOrgSlug!,
                                folder.id,
                                null,
                            );
                        },
                    },
                    ...this.items
                        .map((item) => ({
                            ...item,
                            items: undefined,
                            visible: item.id !== folder.id,
                            command: async (event: MenuItemCommandEvent) => {
                                if (!this.currentOrgSlug)
                                    throw new Error(
                                        'Organization slug is not set',
                                    );
                                if (!folder.id)
                                    throw new Error('Folder id is not set');
                                console.log(event, item);
                                await this.moveFolder(
                                    this.currentOrgSlug!,
                                    folder.id,
                                    item.id || null,
                                );
                            },
                        }))
                        .slice(1), // removing the root folder item
                ],
            },
        ];
    }

    showFolderContextualMenu(event: any, folder: MenuItem) {
        if (
            !this.canCreateFolder &&
            !this.canUpdateFolder &&
            !this.canDeleteFolder
        )
            return;

        if (!folder['data']) return; // no contextual menu for root folder

        this.buildFolderMenu(folder);

        this.selectedFolder = folder['data'];

        this.selectFolder.emit(this.selectedFolder?.id || null);

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.menu.toggle(event);
    }

    onCancelCreate() {
        this.createFolderDialogVisible = false;
    }

    async onConfirmCreate() {
        this.createFolderDialogVisible = false;
        await this.loadFoldersAndCreateMenu(this.currentOrgSlug!);
    }

    onCancelEdit() {
        this.editFolderDialogVisible = false;
    }

    async onConfirmEdit() {
        this.editFolderDialogVisible = false;
        await this.loadFoldersAndCreateMenu(this.currentOrgSlug!);
    }

    async deleteFolder(organizationSlug: Slug, folderId: string) {
        this.confirmationService.confirm({
            key: 'confirm-delete-folder',
            acceptLabel: $localize`Confirm`,
            rejectLabel: $localize`Cancel`,
            accept: async () => {
                await this.folderService
                    .removeFolder(organizationSlug, folderId)
                    .then(async () => {
                        this.messageService.add({
                            severity: 'success',
                            summary: $localize`Success`,
                            detail: $localize`Folder has been deleted successfully.`,
                        });

                        this.selectFolder.emit(null);
                        this.selectedFolder = undefined;
                        // TODO only reset if deleted folder = current or child of current
                        this.removeFolder.emit(folderId);

                        await this.loadFoldersAndCreateMenu(organizationSlug);
                    })
                    .catch((err) => {
                        console.error(err);
                        MessageUtils.parseServerError(
                            this.messageService,
                            err,
                            {
                                summary: $localize`Error deleting folder`,
                            },
                        );
                    });
            },
        });
    }

    async moveFolder(
        organizationSlug: Slug,
        folderId: string,
        folderParentId: string | null,
    ) {
        await this.folderService
            .updateFolderParent(organizationSlug, folderId, folderParentId)
            .then(async () => {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success`,
                    detail: $localize`Folder has been moved successfully.`,
                });

                await this.loadFoldersAndCreateMenu(organizationSlug);
            })
            .catch((err) => {
                console.error(err);
                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error moving folder`,
                });
            });
    }

    handleFolderClick(e: any, item: MenuItem) {
        this.selectFolder.emit(item?.id || null);
        this.selectedFolder = item ? item['data'] : undefined;

        e.stopPropagation();
        e.preventDefault();
    }
}
