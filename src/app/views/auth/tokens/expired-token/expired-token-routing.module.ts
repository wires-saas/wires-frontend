import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ExpiredTokenComponent } from './expired-token.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: ExpiredTokenComponent }
    ])],
    exports: [RouterModule]
})
export class ExpiredTokenRoutingModule {}
