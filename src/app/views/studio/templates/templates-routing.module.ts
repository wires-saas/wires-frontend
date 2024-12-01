import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { TemplatesComponent } from './templates.component';
import {BlockEditorComponent} from "../blocks/block-editor/block-editor.component";
import {TemplateEditorComponent} from "./template-editor/template-editor.component";

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: TemplatesComponent },
            {
                path: 'editor',
                component: TemplateEditorComponent,
                data: { breadcrumb: $localize`Templates` },
            },
            {
                path: ':templateId/editor',
                component: TemplateEditorComponent,
                data: { breadcrumb: $localize`Templates` },
            },
        ]),
    ],
    exports: [RouterModule],
})
export class TemplatesRoutingModule {}
