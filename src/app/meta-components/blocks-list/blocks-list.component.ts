import { Component, EventEmitter, Input, Output } from '@angular/core';
import { BlockRowCardComponent } from './block-row-card/block-row-card.component';
import { NgForOf } from '@angular/common';
import { Block } from '../../services/block.service';
import {ArraySortPipe} from "../../utils/pipes/array-sort.pipe";

@Component({
    selector: 'app-blocks-list',
    templateUrl: './blocks-list.component.html',
    imports: [BlockRowCardComponent, NgForOf, ArraySortPipe],
    standalone: true,
})
export class BlocksListComponent {
    @Input() blocks: Block[] = [];
    @Output() selectBlock = new EventEmitter<Block>();
}
