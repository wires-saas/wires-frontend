import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlockCardComponent } from './block-card/block-card.component';
import { NgForOf } from '@angular/common';
import { Block } from '../../services/block.service';
import { RouterLink } from '@angular/router';

@Component({
    selector: 'app-blocks-list',
    templateUrl: './blocks-list.component.html',
    imports: [BlockCardComponent, NgForOf, RouterLink],
    standalone: true,
})
export class BlocksListComponent {
    @Input() blocks: Block[] = [];
    @Output() selectBlock = new EventEmitter<Block>();
}
