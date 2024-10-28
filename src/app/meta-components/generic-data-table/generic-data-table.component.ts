import {
    Component,
    EventEmitter,
    Input,
    Output,
    TemplateRef,
} from '@angular/core';
import { TableModule } from 'primeng/table';
import { SkeletonModule } from 'primeng/skeleton';
import { DatePipe, NgForOf, NgTemplateOutlet } from '@angular/common';
import { StatusBadgeModule } from '../status-badge/status-badge.module';
import { DurationPipe } from '../../utils/pipes/duration.pipe';

@Component({
    selector: 'app-generic-data-table',
    templateUrl: './generic-data-table.component.html',
    standalone: true,
    imports: [
        TableModule,
        SkeletonModule,
        NgForOf,
        StatusBadgeModule,
        DatePipe,
        DurationPipe,
        NgTemplateOutlet,
    ],
})
export class GenericDataTableComponent {
    @Input() columns: string[] = [];

    @Input() loading: boolean = true;

    @Input() items: any[] = [];

    // Letting parent component define the template for each item for flexibility
    @Input() itemRowTemplate: TemplateRef<any> | null = null;

    @Output() itemSelect: EventEmitter<any> = new EventEmitter<any>();
}
