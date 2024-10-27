import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { SkeletonModule } from 'primeng/skeleton';
import { JsonPipe, NgForOf, NgIf, NgTemplateOutlet } from '@angular/common';
import { GenericDataListItemComponent } from '../generic-data-list-item/generic-data-list-item.component';

@Component({
    selector: 'app-generic-data-list',
    templateUrl: './generic-data-list.component.html',
    standalone: true,
    imports: [
        SkeletonModule,
        NgTemplateOutlet,
        NgForOf,
        NgIf,
        JsonPipe,
        GenericDataListItemComponent
    ]
})
export class GenericDataListComponent {
    @Input() title: string = '';       // Title of the list
    @Input() items: any[] = [];        // List of items to display
    @Input() withItemMenu: boolean = false; // Show item menu
    @Input() canEdit: boolean = false; // Can edit item
    @Input() canDelete: boolean = false; // Can delete item
    @Input() loading: boolean = false; // Loading state
    @Input() itemTemplate: TemplateRef<any> | null = null; // Template for each item
    @Input() emptyMessage: string = 'No items found'; // Message when the list is empty

    @Input() inspectLabel: string = ''; // Label for inspect button
    @Input() inspectIcon: string = 'pi pi-search'; // Icon for inspect button
    @Input() canInspect: boolean = false; // Can inspect item
    @Output() onInspect: EventEmitter<any> = new EventEmitter<any>(); // Inspect facultative item event

    @Output() onEdit: EventEmitter<any> = new EventEmitter<any>(); // Edit item event
    @Output() onDelete: EventEmitter<any> = new EventEmitter<any>(); // Delete item event

    @Output() onItemClick: EventEmitter<any> = new EventEmitter<any>();
}
