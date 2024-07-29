import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ExpiredTokenRoutingModule } from './expired-token-routing.module';
import { ExpiredTokenComponent } from './expired-token.component'
import { ButtonModule } from 'primeng/button';

@NgModule({
    imports: [
        CommonModule,
        ExpiredTokenRoutingModule,
        ButtonModule
    ],
    declarations: [ExpiredTokenComponent]
})
export class ExpiredTokenModule {}
