import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { InformationComponent } from './information.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: InformationComponent }]),
    ],
    exports: [RouterModule],
})
export class InformationRoutingModule {}
