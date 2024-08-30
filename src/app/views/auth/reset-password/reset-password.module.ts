import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ResetPasswordComponent } from './reset-password.component';
import { ResetPasswordRoutingModule } from './reset-password-routing.module';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { RippleModule } from 'primeng/ripple';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { PasswordModule } from 'primeng/password';

@NgModule({
    imports: [
        CommonModule,
        ResetPasswordRoutingModule,
        FormsModule,
        ButtonModule,
        InputTextModule,
        RippleModule,
        AppConfigModule,
        PasswordModule,
    ],
    declarations: [ResetPasswordComponent],
})
export class ResetPasswordModule {}
