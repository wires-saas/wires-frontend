import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StudioRoutingModule } from './studio-routing.module';
import { StudioComponent } from './studio.component';

@NgModule({
    imports: [CommonModule, StudioRoutingModule],
    declarations: [StudioComponent],
})
export class StudioModule {}
