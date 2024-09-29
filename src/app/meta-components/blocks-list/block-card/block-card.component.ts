import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Block } from '../../../services/block.service';

@Component({
    selector: 'app-block-card',
    templateUrl: './block-card.component.html',
    standalone: true
})
export class BlockCardComponent {
    @Input() block!: Block;
    @Output() selectBlock = new EventEmitter<Block>();
}
