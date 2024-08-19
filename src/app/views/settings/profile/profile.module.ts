import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccordionModule } from 'primeng/accordion';
import { RippleModule } from 'primeng/ripple';
import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile-routing.module';

@NgModule({
    imports: [
        CommonModule,
        ProfileRoutingModule,
        AccordionModule,
        RippleModule
    ],
    declarations: [ProfileComponent]
})
export class ProfileModule { }
