import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'users/list',
                data: { breadcrumb: $localize`Users` },
                loadChildren: () =>
                    import('./users/list/list-users.module').then(
                        (m) => m.ListUsersModule,
                    ),
            },
            {
                path: 'users/create',
                data: { breadcrumb: $localize`Users` },
                loadChildren: () =>
                    import(
                        './users/create-or-edit/create-or-edit-user.module'
                    ).then((m) => m.CreateOrEditUserModule),
            },
            {
                path: 'users/:user/edit',
                data: { breadcrumb: $localize`Users` },
                loadChildren: () =>
                    import(
                        './users/create-or-edit/create-or-edit-user.module'
                    ).then((m) => m.CreateOrEditUserModule),
            },
            {
                path: 'information',
                data: { breadcrumb: $localize`General` },
                loadChildren: () =>
                    import('./information/information.module').then(
                        (m) => m.InformationModule,
                    ),
            },
            {
                path: 'configuration',
                data: {
                    breadcrumb: $localize`Configuration`,
                },
                loadChildren: () =>
                    import('./configuration/configuration.module').then(
                        (m) => m.ConfigurationModule,
                    ),
            },
            {
                path: 'billing',
                data: { breadcrumb: $localize`Billing` },
                loadChildren: () =>
                    import('./billing/billing.module').then(
                        (m) => m.BillingModule,
                    ),
            },
            { path: '**', redirectTo: '/not-found' },
        ]),
    ],
    exports: [RouterModule],
    providers: [],
})
export class OrganizationRoutingModule {}
