import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { DatePipe, NgIf } from '@angular/common';
import { Template } from "../../../services/template.service";

@Component({
    selector: 'app-template-card',
    templateUrl: './template-card.component.html',
    imports: [TagModule, NgIf, DatePipe],
    standalone: true,
})
export class TemplateCardComponent {
    @Input() template!: Template;
    @Output() selectTemplate = new EventEmitter<Template>();
}
