import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { Article } from '../../services/article.service';
import { PanelMenu, PanelMenuModule } from 'primeng/panelmenu';
import { RippleModule } from 'primeng/ripple';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';
import { FolderService } from '../../services/folder.service';
import { FolderUtils } from '../../utils/folder.utils';

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
        ContextMenuModule
    ]
})
export class ExplorerComponent implements OnInit {
    @ViewChild('menu') menu!: Menu;
    @ViewChild('panel') panel!: PanelMenu;
    @Input() items: MenuItem[] = [];

    @Input() allIcon: string = 'pi pi-home';
    @Input() folderIcon: string = 'pi pi-folder';
    @Input() itemIcon: string = 'pi-file';

    @Input() folderMenu: MenuItem[] = [];

    selectedItem: MenuItem | undefined;

    newFolderLabel: string = 'New Folder';
    newSubFolderLabel: string = 'New Subfolder';

    constructor(private folderService: FolderService) {
    }

    async ngOnInit() {

        const folders = await this.folderService.getFolders();
        this.items = FolderUtils.foldersToMenuItems(folders);

        this.items = [
            {
                label: 'All',
                icon: this.allIcon,
                command: () => {
                    // ...
                }
            },
            ...this.items
        ];


/*
        this.items = [
            {
                label: 'All',
                icon: this.allIcon,
                command: () => {
                    // ...
                }
            },
            {
                label: 'Headers',
                icon: this.folderIcon,
                id: '1',
                items: [
                    {
                        label: 'Documents',
                        icon: this.folderIcon,
                    },
                    {
                        label: 'Images',
                        icon: this.folderIcon,
                    },
                ]
            },
            {
                label: 'Body',
                icon: 'pi pi-folder',
                id: '2',
                items: [
                    {
                        label: 'Upload',
                        icon: 'pi pi-cloud-upload'
                    },
                    {
                        label: 'Download',
                        icon: 'pi pi-cloud-download'
                    },
                    {
                        label: 'Sync',
                        icon: 'pi pi-refresh'
                    }
                ]
            },
            {
                label: 'Footers',
                icon: 'pi pi-folder',
                id: '3',
                items: [
                    {
                        label: 'Phone',
                        icon: 'pi pi-mobile'
                    },
                    {
                        label: 'Desktop',
                        icon: 'pi pi-desktop'
                    },
                    {
                        label: 'Tablet',
                        icon: 'pi pi-tablet'
                    }
                ]
            },
        ];*/

        this.folderMenu = [];

        this.toggleAll();
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
                label: 'Rename',
                icon: 'pi pi-pen-to-square',
            },
            {
                label: 'Delete',
                icon: 'pi pi-fw pi-trash',
            },
            {
                label: 'Add Folder',
                icon: 'pi pi-fw pi-plus',
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
}
