import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TemplatesRoutingModule } from './templates-routing.module';
import { TemplatesComponent } from './templates.component';

@NgModule({
    imports: [CommonModule, TemplatesRoutingModule],
    declarations: [TemplatesComponent],
})
export class TemplatesModule {}
