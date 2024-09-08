import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudioComponent } from './studio.component';

@NgModule({
    imports: [RouterModule.forChild([{ path: '', component: StudioComponent }])],
    exports: [RouterModule],
})
export class StudioRoutingModule {}
