import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Block } from '../../../services/block.service';
import { TagModule } from 'primeng/tag';
import { DatePipe, NgIf } from '@angular/common';

@Component({
    selector: 'app-block-card',
    templateUrl: './block-card.component.html',
    imports: [TagModule, NgIf, DatePipe],
    standalone: true,
})
export class BlockCardComponent {
    @Input() block!: Block;
    @Output() selectBlock = new EventEmitter<Block>();
}
