import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'contacts',
                data: { breadcrumb: $localize`Contacts` },
                loadChildren: () =>
                    import('./contacts/contacts.module').then(
                        (m) => m.ContactsModule,
                    ),
            },
            {
                path: 'delivery',
                data: { breadcrumb: $localize`Delivery` },
                loadChildren: () =>
                    import('./delivery/delivery.module').then((m) => m.DeliveryModule),
            },
        ]),
    ],
    exports: [RouterModule],
})
export class AudienceRoutingModule {}
