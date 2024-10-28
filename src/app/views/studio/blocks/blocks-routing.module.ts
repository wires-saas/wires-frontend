import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlocksComponent } from './blocks.component';
import { BlockEditorComponent } from './block-editor/block-editor.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                component: BlocksComponent,
                data: { breadcrumb: $localize`Blocks` },
            },
            {
                path: 'editor/html',
                component: BlockEditorComponent,
                data: { breadcrumb: $localize`Blocks`, pureHTML: true },
            },
            {
                path: 'editor',
                component: BlockEditorComponent,
                data: { breadcrumb: $localize`Blocks` },
            },
            {
                path: ':blockId/editor/html',
                component: BlockEditorComponent,
                data: { breadcrumb: $localize`Blocks`, pureHTML: true },
            },
            {
                path: ':blockId/editor',
                component: BlockEditorComponent,
                data: { breadcrumb: $localize`Blocks` },
            },
        ]),
    ],
    exports: [RouterModule],
})
export class BlocksRoutingModule {}
