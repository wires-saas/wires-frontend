import { Component } from '@angular/core';
import { BlockService } from '../../../services/block.service';

@Component({
    templateUrl: './blocks.component.html',
})
export class BlocksComponent {

    constructor(private blockService: BlockService) {
    }

}
