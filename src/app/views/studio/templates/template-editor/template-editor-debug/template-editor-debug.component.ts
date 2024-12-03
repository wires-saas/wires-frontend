import { Component, Input } from '@angular/core';
import {Template} from "../../../../../services/template.service";

@Component({
    selector: 'app-template-editor-debug',
    templateUrl: './template-editor-debug.component.html',
})
export class TemplateEditorDebugComponent {
    @Input() template!: Template;
    @Input() darkMode!: boolean;
}
