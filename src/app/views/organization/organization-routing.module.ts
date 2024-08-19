import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HasRoleGuard } from '../../guards/has-role.guard';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'users/list',
            data: { breadcrumb: $localize `Users`, requiredRole: 'manager' },
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./users/list/list-users.module').then(m => m.ListUsersModule)
        },
        {
            path: 'users/create',
            data: { breadcrumb: $localize `Users`, requiredRole: 'manager' },
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./users/create-or-edit/create-or-edit-user.module').then(m => m.CreateOrEditUserModule)
        },
        {
            path: 'users/:user/edit',
            data: { breadcrumb: $localize `Users`, requiredRole: 'manager' },
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./users/create-or-edit/create-or-edit-user.module').then(m => m.CreateOrEditUserModule)
        },
        {
            path: 'information',
            data: { breadcrumb: $localize `General`, requiredRole: 'admin'},
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./information/information.module').then(m => m.InformationModule)
        },
        {
            path: 'configuration',
            data: { breadcrumb: $localize `Configuration`, requiredRole: 'admin'},
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./configuration/configuration.module').then(m => m.ConfigurationModule)
        },
        {
            path: 'billing',
            data: { breadcrumb: $localize `Billing`, requiredRole: 'admin' },
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule)
        },
        { path: '**', redirectTo: '/not-found' }
    ])],
    exports: [RouterModule],
    providers: [HasRoleGuard]
})
export class OrganizationRoutingModule {}
