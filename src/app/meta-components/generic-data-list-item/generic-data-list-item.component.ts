import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { Ripple } from 'primeng/ripple';
import { MenuItemCommandEvent } from 'primeng/api';

@Component({
    selector: 'app-generic-data-list-item',
    templateUrl: './generic-data-list-item.component.html',
    standalone: true,
    imports: [
        NgForOf,
        ButtonDirective,
        MenuModule,
        Ripple,
        NgIf
    ]
})
export class GenericDataListItemComponent implements OnInit {
    @ViewChild('menu') menu!: Menu;
    @Input() item: any;
    @Input() showMenu: boolean = false;
    @Input() menuItems: any[] = [];

    @Input() inspectLabel: string = '';
    @Input() inspectIcon: string = 'pi pi-search';
    @Input() canInspect: boolean = false;
    @Output() onInspect: EventEmitter<any> = new EventEmitter<any>();

    @Input() canEdit: boolean = false;
    @Output() onEdit: EventEmitter<any> = new EventEmitter<any>();

    @Input() canDelete: boolean = false;
    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();

    @Output() onItemClick: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {
        this.menuItems = [
            {
                label: $localize`Edit`,
                icon: 'pi pi-pencil',
                disabled: !this.canEdit,
                command: (e: MenuItemCommandEvent) => {
                    e.originalEvent?.stopPropagation();
                    this.onEdit.emit(this.item)
                },
            },
            {
                label: $localize`Delete`,
                icon: 'pi pi-trash',
                disabled: !this.canDelete,
                command: (e: MenuItemCommandEvent) => {
                    e.originalEvent?.stopPropagation();
                    this.onDelete.emit(this.item);
                },
            },
        ];

        if (this.canInspect) {
            this.menuItems = [
                {
                    label: this.inspectLabel,
                    icon: this.inspectIcon,
                    command: (e: MenuItemCommandEvent) => {
                        e.originalEvent?.stopPropagation();
                        this.onInspect.emit(this.item)
                    },
                },
                ...this.menuItems,
            ];
        }
    }

    emitShowMenu(event: Event) {
        event.stopPropagation();
        this.menu.toggle(event);
    }
}
