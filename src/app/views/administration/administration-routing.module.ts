import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'organizations/list', data: {breadcrumb: 'Organizations'}, loadChildren: () => import('./organizations/list/list-organizations.module').then(m => m.ListOrganizationsModule) },
        { path: 'organizations/create', data: {breadcrumb: 'Organizations'}, loadChildren: () => import('./organizations/create/create-organization.module').then(m => m.CreateOrganizationModule) },
        { path: 'organizations/users/list', data: {breadcrumb: 'Organizations', multiOrganizations: true}, loadChildren: () => import('./../organization/users/list/list-users.module').then(m => m.ListUsersModule)  },
        { path: 'organizations/users/create', data: {breadcrumb: 'Organizations' }, loadChildren: () => import('../organization/users/create-or-edit/create-or-edit-user.module').then(m => m.CreateOrEditUserModule)  },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AdministrationRoutingModule { }
