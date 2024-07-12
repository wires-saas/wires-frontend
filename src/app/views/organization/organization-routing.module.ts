import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'users/list', data: {breadcrumb: 'Users'}, loadChildren: () => import('./users/list/list-users.module').then(m => m.ListUsersModule) },
        { path: 'users/create', data: {breadcrumb: 'Users'}, loadChildren: () => import('./users/create/create-user.module').then(m => m.CreateUserModule) },
        { path: 'information', data: {breadcrumb: 'General'}, loadChildren: () => import('./information/information.module').then(m => m.InformationModule) },
        { path: 'billing', data: {breadcrumb: 'Billing'}, loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class OrganizationRoutingModule { }
