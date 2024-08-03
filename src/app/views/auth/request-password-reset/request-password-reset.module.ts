import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RequestPasswordResetRoutingModule } from './request-password-reset-routing.module';
import { RequestPasswordResetComponent } from './request-password-reset.component';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { MessagesModule } from 'primeng/messages';
import { MessageModule } from 'primeng/message';

@NgModule({
    imports: [
        CommonModule,
        ButtonModule,
        InputTextModule,
        RequestPasswordResetRoutingModule,
        MessagesModule,
        MessageModule,
        AppConfigModule
    ],
    declarations: [RequestPasswordResetComponent]
})
export class RequestPasswordResetModule { }
