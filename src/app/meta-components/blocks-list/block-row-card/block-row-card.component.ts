import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Block } from '../../../services/block.service';
import { TagModule } from 'primeng/tag';
import { DatePipe, NgIf } from '@angular/common';

@Component({
    selector: 'app-block-row-card',
    templateUrl: './block-row-card.component.html',
    imports: [TagModule, NgIf, DatePipe],
    standalone: true,
})
export class BlockRowCardComponent {
    @Input() block!: Block;
    @Output() selectBlock = new EventEmitter<Block>();
}
