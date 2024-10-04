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
import { ExplorerEditDialogComponent } from './edit-dialog/edit-dialog.component';
import { ExplorerCreateDialogComponent } from './create-dialog/create-dialog.component';

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
        ExplorerCreateDialogComponent
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

    createFolderDialogVisible: boolean = false;

    editFolderDialogVisible: boolean = false;

    selectedFolder: Folder | undefined;


    currentOrgSlug: Slug | undefined;

    constructor(private organizationService: OrganizationService, private folderService: FolderService) {
    }

    async ngOnInit() {

        this.organizationService.currentOrganization$.pipe(
            map(async (organization) => {
                this.currentOrgSlug = organization?.slug;
                if (organization) {
                    await this.loadFoldersAndCreateMenu(organization.slug);
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

                    this.selectedFolder = folder['data'];
                    this.editFolderDialogVisible = true;
                    // TODO handle backdrop/cross click
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
                    if (!this.currentOrgSlug) throw new Error('Organization slug is not set');
                    if (!folder.id) throw new Error('Folder id is not set');

                    this.selectedFolder = folder['data'];
                    this.createFolderDialogVisible = true;
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

        this.buildFolderMenu(folder);

        if (folder.id === this.allFoldersId) this.selectedItem = undefined;
        else this.selectedItem = folder;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.menu.toggle(event);
    }

    onCancelCreate() {
        this.createFolderDialogVisible = false;
        this.selectedFolder = undefined;
    }

    async onConfirmCreate() {
        this.createFolderDialogVisible = false;
        await this.loadFoldersAndCreateMenu(this.currentOrgSlug!);
    }

    onCancelEdit() {
        this.editFolderDialogVisible = false;
        this.selectedFolder = undefined;
    }

    async onConfirmEdit() {
        this.editFolderDialogVisible = false;
        await this.loadFoldersAndCreateMenu(this.currentOrgSlug!);
    }

}
