import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HomeComponent } from './home.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: '',
                data: { breadcrumb: $localize`Home` },
                component: HomeComponent,
            },
        ]),
    ],
    exports: [RouterModule],
    providers: [],
})
export class HomeRoutingModule {}
