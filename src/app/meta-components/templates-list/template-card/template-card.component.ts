import { Component, EventEmitter, Input, Output } from '@angular/core';
import { TagModule } from 'primeng/tag';
import { DatePipe, NgIf } from '@angular/common';
import { Template } from "../../../services/template.service";
import {ButtonDirective} from "primeng/button";
import {EmptyTemplateIconPipe} from "../../../utils/pipes/empty-template-icon.pipe";
import {Ripple} from "primeng/ripple";

@Component({
    selector: 'app-template-card',
    templateUrl: './template-card.component.html',
    imports: [TagModule, NgIf, DatePipe, ButtonDirective, EmptyTemplateIconPipe, Ripple],
    standalone: true,
})
export class TemplateCardComponent {
    @Input() template!: Template;
    @Output() selectTemplate = new EventEmitter<Template>();
}
