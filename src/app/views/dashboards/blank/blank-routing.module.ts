import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BlankComponent } from './blank.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: BlankComponent }])],
    exports: [RouterModule],
})
export class BlankRoutingModule {}
