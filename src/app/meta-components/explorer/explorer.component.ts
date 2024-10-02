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
    @Inject(DestroyRef) private destroyRef: DestroyRef = inject(DestroyRef);

    @ViewChild('menu') menu!: Menu;
    @ViewChild('panel') panel!: PanelMenu;
    @Input() items: MenuItem[] = [];

    @Input() allIcon: string = 'pi pi-home';
    @Input() folderIcon: string = 'pi pi-folder';
    @Input() itemIcon: string = 'pi-file';

    @Input() folderMenu: MenuItem[] = [];

    @Output() selectFolder: EventEmitter<Folder['id'] | null> = new EventEmitter<Folder['id'] | null>();

    selectedItem: MenuItem | undefined;

    newFolderLabel: string = 'New Folder';
    newSubFolderLabel: string = 'New Subfolder';

    currentOrgSlug: Slug | undefined;

    constructor(private organizationService: OrganizationService, private folderService: FolderService) {
    }

    async ngOnInit() {


        this.organizationService.currentOrganization$.pipe(
            map(async (organization) => {
                this.currentOrgSlug = organization?.slug;
                if (organization) {
                    console.log('explorer > organization', organization);
                    const folders = await this.folderService.getFolders(organization.slug);

                    // Handler for folder click
                    const onFolderClick = async (event: MenuItemCommandEvent) => {
                        this.selectFolder.emit(event?.item?.id);
                    }

                    // Dynamic instantiation of the menu items
                    this.items = FolderUtils.foldersToMenuItems(folders, onFolderClick);

                    this.items = [
                        {
                            label: 'All',
                            icon: this.allIcon,
                            command: () => {
                                this.selectFolder.emit(null);
                            }
                        },
                        ...this.items
                    ];
                    console.log(this.items);
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

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
