import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { CanActivateOrganization } from './guards/can-activate-organization.guard';
import { CanActivateAdministration } from './guards/can-activate-administration.guard';
import { AutologinGuard } from './guards/autologin.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled'
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            // { path: '', loadChildren: () => import('./demo/components/dashboards/dashboards.module').then(m => m.DashboardsModule) },
            { path: 'uikit', data: { breadcrumb: 'UI Kit' }, loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
            { path: 'utilities', data: { breadcrumb: 'Utilities' }, loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
            // { path: 'pages', data: { breadcrumb: 'Pages' }, loadChildren: () => import('./demo/components/pages/pages.module').then(m => m.PagesModule) },
            // { path: 'profile', data: { breadcrumb: 'User Management' }, loadChildren: () => import('./demo/components/profile/profile.module').then(m => m.ProfileModule) },
            { path: 'documentation', data: { breadcrumb: 'Documentation' }, loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
            { path: 'blocks', data: { breadcrumb: 'Prime Blocks' }, loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
            { path: 'ecommerce', data: { breadcrumb: 'E-Commerce' }, loadChildren: () => import('./demo/components/ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
            { path: 'apps', data: { breadcrumb: 'Apps' }, loadChildren: () => import('./demo/components/apps/apps.module').then(m => m.AppsModule) },

            // Implemented routes
            { path: '', loadChildren: () => import('./views/dashboards/dashboards.module').then(m => m.DashboardsModule) },
            {
                path: 'administration',
                data: { breadcrumb: 'Administration' },
                canActivate: [CanActivateAdministration],
                loadChildren: () => import('./views/administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'organization/:slug',
                data: { breadcrumb: 'My Organization' },
                canActivate: [CanActivateOrganization],
                loadChildren: () => import('./views/organization/organization.module').then(m => m.OrganizationModule)
            },
            { path: 'help', data: { breadcrumb: 'Help' }, loadChildren: () => import('./views/help/help.module').then(m => m.HelpModule) }
        ]
    },
    // { path: 'auth', data: { breadcrumb: 'Auth' }, loadChildren: () => import('./demo/components/auth/auth.module').then(m => m.AuthModule) },
    // { path: 'landing', loadChildren: () => import('./demo/components/landing/landing.module').then(m => m.LandingModule) },
    { path: 'notfound', loadChildren: () => import('./demo/components/notfound/notfound.module').then(m => m.NotfoundModule) },

    // Implemented routes
    {
        path: 'auth',
        data: { breadcrumb: 'Auth' },
        canActivate: [AutologinGuard],
        loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule)
    },
    { path: 'landing', loadChildren: () => import('./views/landing/landing.module').then(m => m.LandingModule) },

    { path: '**', redirectTo: '/notfound' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule],
    providers: [CanActivateOrganization, CanActivateAdministration, AutologinGuard]
})
export class AppRoutingModule { }
