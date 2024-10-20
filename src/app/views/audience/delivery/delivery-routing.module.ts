import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { DeliveryComponent } from './delivery.component';

@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: DeliveryComponent }]),
    ],
    exports: [RouterModule],
})
export class DeliveryRoutingModule {}
