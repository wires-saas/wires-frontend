import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { HasRoleGuard } from '../../guards/has-role.guard';

@NgModule({
    imports: [RouterModule.forChild([
        {
            path: 'users/list',
            data: { breadcrumb: 'Users', requiredRole: 'manager' },
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./users/list/list-users.module').then(m => m.ListUsersModule)
        },
        {
            path: 'users/create',
            data: { breadcrumb: 'Users', requiredRole: 'manager' },
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./users/create/create-user.module').then(m => m.CreateUserModule)
        },
        {
            path: 'information',
            data: { breadcrumb: 'General', requiredRole: 'admin'},
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./information/information.module').then(m => m.InformationModule)
        },
        {
            path: 'billing',
            data: { breadcrumb: 'Billing', requiredRole: 'admin' },
            canActivate: [HasRoleGuard],
            loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule)
        },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule],
    providers: [HasRoleGuard]
})
export class OrganizationRoutingModule {}
