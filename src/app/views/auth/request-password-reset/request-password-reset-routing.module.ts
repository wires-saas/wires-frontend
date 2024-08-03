import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { RequestPasswordResetComponent } from './request-password-reset.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: RequestPasswordResetComponent }
    ])],
    exports: [RouterModule]
})
export class RequestPasswordResetRoutingModule { }
