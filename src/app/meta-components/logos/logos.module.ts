import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StyleClassModule } from 'primeng/styleclass';
import { AppConfigModule } from 'src/app/layout/config/app.config.module';
import { LogoPhraseComponent } from './logo-phrase.component';
import { LogoComponent } from './logo.component';

@NgModule({
    imports: [
        CommonModule,
        StyleClassModule,
        AppConfigModule,
    ],
    exports: [
        LogoPhraseComponent,
        LogoComponent
    ],
    declarations: [LogoPhraseComponent, LogoComponent]
})
export class LogosModule { }
