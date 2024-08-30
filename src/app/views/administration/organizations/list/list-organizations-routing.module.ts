import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ListOrganizationsComponent } from './list-organizations.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ListOrganizationsComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ListOrganizationsRoutingModule {}
