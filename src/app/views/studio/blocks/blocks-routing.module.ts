import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlocksComponent } from './blocks.component';
import { BlockEditorComponent } from './block-editor/block-editor.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: BlocksComponent },
        { path: 'editor', component: BlockEditorComponent }
    ])],
    exports: [RouterModule],
})
export class BlocksRoutingModule {}
