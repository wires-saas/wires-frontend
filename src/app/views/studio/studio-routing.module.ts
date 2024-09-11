import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { StudioComponent } from './studio.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: StudioComponent },
        {
            path: 'blocks',
            loadChildren: () =>
                import('./blocks/blocks.module').then(
                    (m) => m.BlocksModule,
                ),
        },
        {
            path: 'templates',
            loadChildren: () =>
                import('./templates/templates.module').then(
                    (m) => m.TemplatesModule,
                ),
        }
    ])],
    exports: [RouterModule],
})
export class StudioRoutingModule {}
