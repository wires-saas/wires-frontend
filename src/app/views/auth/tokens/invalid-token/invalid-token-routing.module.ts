import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InvalidTokenComponent } from './invalid-token.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: InvalidTokenComponent }
    ])],
    exports: [RouterModule]
})
export class InvalidTokenRoutingModule {}
