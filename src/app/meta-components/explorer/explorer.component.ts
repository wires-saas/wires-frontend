import { Component, DestroyRef, EventEmitter, inject, Inject, Input, OnInit, Output, ViewChild } from '@angular/core';
import { MenuItem, MenuItemCommandEvent, SelectItem } from 'primeng/api';
import { Article } from '../../services/article.service';
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
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MessageModule } from 'primeng/message';
import { ErrorUtils } from '../../utils/error.utils';

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
        MessageModule
    ]
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

    @Output() selectFolder: EventEmitter<Folder['id'] | null> = new EventEmitter<Folder['id'] | null>();
    @Output() removeFolder: EventEmitter<Folder['id'] | null> = new EventEmitter<Folder['id'] | null>();

    selectedItem: MenuItem | undefined;

    allFoldersId: string = 'all';
    newFolderLabel: string = 'New Folder';
    newSubFolderLabel: string = 'New Subfolder';

    createFolderDialogVisible: boolean = false;
    createFolderDialogOptions: { parentFolderDisplayName: string, parentFolderId: string | null } = {
        parentFolderDisplayName: '',
        parentFolderId: null,
    };
    createFolderForm: FormGroup = new FormGroup({
        displayName: new FormControl<string>('', Validators.required),
        description: new FormControl<string>('')
    });

    editFolderDialogVisible: boolean = false;
    editFolderDialogOptions: {
        folderId: Folder['id'] | null;
        loading: boolean;
        error?: string;
    } = { folderId: null, loading: false }

    editFolderForm: FormGroup = new FormGroup({
        displayName: new FormControl<string>('', Validators.required),
        description: new FormControl<string>('')
    });

    currentOrgSlug: Slug | undefined;

    constructor(private organizationService: OrganizationService, private folderService: FolderService) {
    }

    async ngOnInit() {


        this.organizationService.currentOrganization$.pipe(
            map(async (organization) => {
                this.currentOrgSlug = organization?.slug;
                if (organization) {
                    console.log('explorer > organization', organization);
                    this.loadFoldersAndCreateMenu(organization.slug);

                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this.folderMenu = [];

        this.toggleAll();
    }

    private async loadFoldersAndCreateMenu(organizationSlug: Slug) {
        const folders = await this.folderService.getFolders(organizationSlug);

        // Handler for folder click
        const onFolderClick = async (event: MenuItemCommandEvent) => {
            this.selectFolder.emit(event?.item?.id);
            this.selectedItem = event?.item;
        }

        // Dynamic instantiation of the menu items
        this.items = FolderUtils.foldersToMenuItems(null, folders, onFolderClick);

        this.items = [
            {
                label: 'All',
                id: this.allFoldersId,
                icon: this.allIcon,
                command: () => {
                    this.selectFolder.emit(null);
                    this.selectedItem = undefined;
                }
            },
            ...this.items
        ];
        console.log(this.items);
    }

    private areAllItemsExpanded(): boolean {
        return this.items.every((menuItem) => menuItem.expanded);
    }

    toggleAll() {
        const expanded = !this.areAllItemsExpanded();
        this.items = this.toggleAllRecursive(this.items, expanded);
    }

    private toggleAllRecursive(items: MenuItem[], expanded: boolean): MenuItem[] {
        return items.map((menuItem) => {
            menuItem.expanded = expanded;
            if (menuItem.items) {
                menuItem.items = this.toggleAllRecursive(menuItem.items, expanded);
            }
            return menuItem;
        });
    }

    private buildFolderMenu(folder: MenuItem): void {
        this.folderMenu = [
            {
                label: 'Edit',
                icon: 'pi pi-pencil',
                command: async () => {
                    if (!this.currentOrgSlug) throw new Error('Organization slug is not set');
                    if (!folder.id) throw new Error('Folder id is not set');

                    this.openEditFolderDialog(folder.id, folder['data'].displayName, folder['data'].description);
                }
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
                command: async () => {
                    if (!this.currentOrgSlug) throw new Error('Organization slug is not set');
                    if (!folder.id) throw new Error('Folder id is not set');

                    this.selectFolder.emit(null);
                    this.selectedItem = undefined;
                    this.removeFolder.emit(folder.id);

                    await this.folderService.removeFolder(this.currentOrgSlug, folder.id);
                    await this.loadFoldersAndCreateMenu(this.currentOrgSlug);
                }
            },
            {
                label: 'Add Folder',
                icon: 'pi pi-fw pi-plus',
                command: async () => {
                    this.openCreateFolderDialog(folder.id || null, folder.label);
                }

            },
            {
                separator: true,
            },
            {
                label: 'Move to',
                icon: 'pi pi-fw pi-arrows-alt',
                items: [
                    {
                      label: 'Root', items: undefined,
                    },
                    ...this.items.map(item => ({...item, items: undefined, visible: item.id !== folder.id }))
                        .slice(1) // removing the root folder item
                ]
            }
        ];
    }

    showFolderMenu(event: any, folder: MenuItem) {

        if (folder.label === this.newSubFolderLabel) {
            return;
        }

        console.log(folder.id);

        this.buildFolderMenu(folder);

        this.selectedItem = folder;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.menu.toggle(event);
        folder.styleClass = 'p-menuitem-active';

        console.log(folder);
    }

    openCreateFolderDialog(parentFolderId: Folder['id'] | null, parentFolderDisplayName?: string) {
        this.createFolderDialogOptions = {
            parentFolderDisplayName: parentFolderDisplayName || '',
            parentFolderId: parentFolderId || null,
        };

        this.createFolderDialogVisible = true;
        console.log('create folder', parentFolderId);
    }

    cancelFolderCreation() {
        this.createFolderDialogVisible = false;
    }

    async confirmFolderCreation() {
        this.createFolderDialogVisible = false;

        const displayName = this.createFolderForm.get('displayName')?.value;
        const description = this.createFolderForm.get('description')?.value;

        if (!this.currentOrgSlug) throw new Error('Organization slug is not set');
        if (!displayName) throw new Error('Display name is required');

        await this.folderService.createFolder(
            this.currentOrgSlug,
            displayName,
            description,
            this.createFolderDialogOptions.parentFolderId
        );
        await this.loadFoldersAndCreateMenu(this.currentOrgSlug);
    }


    openEditFolderDialog(folderId: Folder['id'], folderDisplayName: string, folderDescription: string) {
        this.editFolderForm.setValue({
            displayName: folderDisplayName,
            description: folderDescription
        });

        this.editFolderDialogOptions = { folderId, loading: false };

        this.editFolderDialogVisible = true;
    }

    cancelFolderEdition() {
        this.editFolderDialogVisible = false;
        this.editFolderForm.reset();
        this.editFolderDialogOptions = { folderId: null, loading: false };
    }

    async confirmFolderEdition() {

        const displayName = this.editFolderForm.get('displayName')?.value;
        const description = this.editFolderForm.get('description')?.value;

        if (!this.currentOrgSlug) throw new Error('Organization slug is not set');
        if (!this.editFolderDialogOptions.folderId) throw new Error('Folder id is not set');
        if (!displayName) throw new Error('Display name is required');

        this.editFolderDialogOptions.loading = true;

        setTimeout(async () => {
            if (!this.currentOrgSlug) throw new Error('Organization slug is not set');
            if (!this.editFolderDialogOptions.folderId) throw new Error('Folder id is not set');
            if (!displayName) throw new Error('Display name is required');

            await this.folderService.updateFolder(
                this.currentOrgSlug,
                this.editFolderDialogOptions.folderId,
                displayName,
                description
            ).then(() => {
                this.cancelFolderEdition();
                return this.loadFoldersAndCreateMenu(this.currentOrgSlug!);
            }).catch (err => {
                console.error(err);
                this.editFolderDialogOptions.error = ErrorUtils.getErrorMessage(err);
                this.editFolderDialogOptions.loading = false;
                console.log(this.editFolderDialogOptions);
            });

        }, 1000);
    }
}
