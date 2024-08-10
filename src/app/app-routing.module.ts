import { NgModule } from '@angular/core';
import { ExtraOptions, RouterModule, Routes } from '@angular/router';
import { AppLayoutComponent } from './layout/app.layout.component';
import { AuthenticatedGuard } from './guards/authenticated.guard';
import { IsSuperAdminGuard } from './guards/is-super-admin.guard';

const routerOptions: ExtraOptions = {
    anchorScrolling: 'enabled',
};

const routes: Routes = [
    {
        path: '', component: AppLayoutComponent,
        children: [
            { path: 'uikit', data: { breadcrumb: $localize `UI Kit` }, loadChildren: () => import('./demo/components/uikit/uikit.module').then(m => m.UIkitModule) },
            { path: 'utilities', data: { breadcrumb: $localize `Utilities` }, loadChildren: () => import('./demo/components/utilities/utilities.module').then(m => m.UtilitiesModule) },
            { path: 'documentation', data: { breadcrumb: $localize `Documentation` }, loadChildren: () => import('./demo/components/documentation/documentation.module').then(m => m.DocumentationModule) },
            { path: 'blocks', data: { breadcrumb: $localize `Prime Blocks` }, loadChildren: () => import('./demo/components/primeblocks/primeblocks.module').then(m => m.PrimeBlocksModule) },
            { path: 'ecommerce', data: { breadcrumb: $localize `E-Commerce` }, loadChildren: () => import('./demo/components/ecommerce/ecommerce.module').then(m => m.EcommerceModule) },
            { path: 'apps', data: { breadcrumb: $localize `Apps` }, loadChildren: () => import('./demo/components/apps/apps.module').then(m => m.AppsModule) },

            // Implemented routes
            {
                path: '',
                canActivate: [AuthenticatedGuard],
                loadChildren: () => import('./views/dashboards/dashboards.module').then(m => m.DashboardsModule)
            },
            {
                path: 'administration',
                data: { breadcrumb: $localize `Administration` },
                canActivate: [AuthenticatedGuard, IsSuperAdminGuard],
                loadChildren: () => import('./views/administration/administration.module').then(m => m.AdministrationModule)
            },
            {
                path: 'organization/:slug',
                data: { breadcrumb: $localize `My Organization` },
                canActivate: [AuthenticatedGuard],
                loadChildren: () => import('./views/organization/organization.module').then(m => m.OrganizationModule)
            },
            { path: 'help', data: { breadcrumb: $localize `Help` }, loadChildren: () => import('./views/help/help.module').then(m => m.HelpModule) }
        ]
    },

    { path: 'not-found', loadChildren: () => import('./views/auth/not-found/not-found.module').then(m => m.NotFoundModule) },

    // Implemented routes
    {
        path: 'auth',
        data: { breadcrumb: $localize `Auth` },
        loadChildren: () => import('./views/auth/auth.module').then(m => m.AuthModule)
    },
    { path: 'landing', loadChildren: () => import('./views/landing/landing.module').then(m => m.LandingModule) },

    { path: '**', redirectTo: '/not-found' }
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule],
    providers: [
        IsSuperAdminGuard,
        AuthenticatedGuard
    ]
})
export class AppRoutingModule { }
