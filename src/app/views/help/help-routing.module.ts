import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'contact',
                data: { breadcrumb: 'Contact' },
                loadChildren: () =>
                    import('./contact/contact.module').then(
                        (m) => m.ContactModule,
                    ),
            },
            {
                path: 'faq',
                data: { breadcrumb: 'FAQ' },
                loadChildren: () =>
                    import('./faq/faq.module').then((m) => m.FaqModule),
            },
            { path: '**', redirectTo: '/not-found' },
        ]),
    ],
    exports: [RouterModule],
})
export class HelpRoutingModule {}
