import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TemplateCardComponent } from './template-card/template-card.component';
import { NgForOf } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Template } from "../../services/template.service";

@Component({
    selector: 'app-templates-list',
    templateUrl: './templates-list.component.html',
    imports: [TemplateCardComponent, NgForOf, RouterLink],
    standalone: true,
})
export class TemplatesListComponent {
    @Input() templates: Template[] = [];
    @Output() selectTemplate = new EventEmitter<Template>();
}
