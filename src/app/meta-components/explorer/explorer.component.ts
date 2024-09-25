import { Component, Input, OnInit, ViewChild } from '@angular/core';
import { MenuItem, SelectItem } from 'primeng/api';
import { Article } from '../../services/article.service';
import { PanelMenu, PanelMenuModule } from 'primeng/panelmenu';
import { RippleModule } from 'primeng/ripple';
import { NgIf } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { ContextMenuModule } from 'primeng/contextmenu';

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

    ngOnInit() {



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
                items: [
                    {
                        label: 'Documents',
                        icon: this.folderIcon,
                    },
                    {
                        label: 'Images',
                        icon: this.folderIcon,
                    },
                    {
                        label: this.newSubFolderLabel,
                        icon: 'pi pi-plus',
                        command: () => {
                            // ...
                        }
                    }
                ]
            },
            {
                label: 'Body',
                icon: 'pi pi-folder',
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
            {
                label: 'New Folder',
                icon: 'pi pi-plus',
                command: () => {
                    // this.messageService.add({ severity: 'info', summary: 'Signed out', detail: 'User logged out', life: 3000 });
                }
            }
        ];

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
                separator: true,
            },
            {
                label: 'Move to',
                icon: 'pi pi-fw pi-home',
                items: [
                    ...this.items.map(item => ({ ...item, items: undefined }))
                        .slice(-1) // removing the add folder item
                ]
            },
        ];

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

    showFolderMenu(event: any, folder: MenuItem) {

        if (folder.label === this.newSubFolderLabel) {
            return;
        }

        this.selectedItem = folder;

        event.preventDefault();
        event.stopPropagation();
        event.stopImmediatePropagation();
        this.menu.toggle(event);
        folder.styleClass = 'p-menuitem-active';

        console.log(folder);

    }
}
