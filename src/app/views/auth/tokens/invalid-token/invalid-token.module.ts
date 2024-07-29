import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InvalidTokenRoutingModule } from './invalid-token-routing.module';
import { InvalidTokenComponent } from './invalid-token.component'
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        InvalidTokenRoutingModule,
        ButtonModule
    ],
    declarations: [InvalidTokenComponent]
})
export class InvalidTokenModule {}
