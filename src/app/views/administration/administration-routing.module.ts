import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'organizations/list', data: {breadcrumb: 'Organizations'}, loadChildren: () => import('./organizations/list/list-organizations.module').then(m => m.ListOrganizationsModule) },
        { path: 'organizations/create', data: {breadcrumb: 'Organizations'}, loadChildren: () => import('./organizations/create/create-organization.module').then(m => m.CreateOrganizationModule) },
        { path: '**', redirectTo: '/notfound' }
    ])],
    exports: [RouterModule]
})
export class AdministrationRoutingModule { }
