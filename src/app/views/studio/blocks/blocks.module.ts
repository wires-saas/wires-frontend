import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlocksComponent } from './blocks.component';
import { BlocksRoutingModule } from './blocks-routing.module';

@NgModule({
    imports: [CommonModule, BlocksRoutingModule],
    declarations: [BlocksComponent],
})
export class BlocksModule {}
