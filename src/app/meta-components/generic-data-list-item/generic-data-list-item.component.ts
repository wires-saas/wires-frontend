import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';
import { NgForOf, NgIf } from '@angular/common';
import { ButtonDirective } from 'primeng/button';
import { Menu, MenuModule } from 'primeng/menu';
import { Ripple } from 'primeng/ripple';

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

    @Input() canEdit: boolean = false;
    @Output() onEdit: EventEmitter<any> = new EventEmitter<any>();

    @Input() canDelete: boolean = false;
    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>();

    ngOnInit() {
        this.menuItems = [
            {
                label: $localize`Edit`,
                icon: 'pi pi-pencil',
                disabled: !this.canEdit,
                command: () => this.onEdit.emit(this.item),
            },
            {
                label: $localize`Delete`,
                icon: 'pi pi-trash',
                disabled: !this.canDelete,
                command: () => this.onDelete.emit(this.item),
            },
        ];
    }

    emitShowMenu(event: MouseEvent) {
        this.menu.toggle(event);
    }
}
