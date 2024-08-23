import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { FeedsComponent } from './feeds.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: FeedsComponent }
    ])],
    exports: [RouterModule]
})
export class FeedsRoutingModule { }
