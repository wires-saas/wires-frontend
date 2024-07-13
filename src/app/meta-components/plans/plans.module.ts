import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { RouterModule } from '@angular/router';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { PlansComponent } from './plans.component';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        RouterModule,
        StyleClassModule,
        AppConfigModule,
    ],
    exports: [
        PlansComponent
    ],
    declarations: [PlansComponent]
})
export class PlansModule { }
