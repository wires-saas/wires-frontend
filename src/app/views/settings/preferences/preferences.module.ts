import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { RippleModule } from 'primeng/ripple';
import { PreferencesComponent } from './preferences.component';
import { PreferencesRoutingModule } from './preferences-routing.module';

@NgModule({
    imports: [
        CommonModule,
        PreferencesRoutingModule,
        AccordionModule,
        RippleModule,
    ],
    declarations: [PreferencesComponent],
})
export class PreferencesModule {}
