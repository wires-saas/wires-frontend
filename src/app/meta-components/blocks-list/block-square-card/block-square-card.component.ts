import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Block } from '../../../services/block.service';
import { TagModule } from 'primeng/tag';
import { DatePipe, NgIf } from '@angular/common';

@Component({
    selector: 'app-block-square-card',
    templateUrl: './block-square-card.component.html',
    imports: [TagModule, NgIf, DatePipe],
    standalone: true,
})
export class BlockSquareCardComponent {
    @Input() block!: Block;
    @Output() selectBlock = new EventEmitter<Block>();
}
