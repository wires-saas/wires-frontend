import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotFoundRoutingModule } from './not-found-routing.module';
import { NotFoundComponent } from './not-found.component';
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [CommonModule, NotFoundRoutingModule, ButtonModule],
    declarations: [NotFoundComponent],
})
export class NotFoundModule {}
