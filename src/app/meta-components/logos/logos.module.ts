import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { LogoPhraseComponent } from './logo-phrase.component';
import { LogoComponent } from './logo.component';
import { LogoTextlessComponent } from './logo-textless.component';

@NgModule({
    imports: [CommonModule, StyleClassModule, AppConfigModule],
    exports: [LogoPhraseComponent, LogoTextlessComponent, LogoComponent],
    declarations: [LogoPhraseComponent, LogoTextlessComponent, LogoComponent],
})
export class LogosModule {}
