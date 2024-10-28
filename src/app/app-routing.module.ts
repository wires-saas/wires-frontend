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
        path: '',
        component: AppLayoutComponent,
        children: [
            {
                path: 'organization/:slug/studio',
                data: { breadcrumb: $localize`Studio` },
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import('./views/studio/studio.module').then(
                        (m) => m.StudioModule,
                    ),
            },
            {
                path: 'organization/:slug/audience',
                data: { breadcrumb: $localize`Audience` },
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import('./views/audience/audience.module').then(
                        (m) => m.AudienceModule,
                    ),
            },
            {
                path: 'organization/:slug/contents',
                data: { breadcrumb: $localize`Contents` },
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import('./views/contents/contents.module').then(
                        (m) => m.ContentsModule,
                    ),
            },
            {
                path: 'administration',
                data: { breadcrumb: $localize`Administration` },
                canActivate: [AuthenticatedGuard, IsSuperAdminGuard],
                loadChildren: () =>
                    import('./views/administration/administration.module').then(
                        (m) => m.AdministrationModule,
                    ),
            },

            {
                path: 'organization/:slug/mail',
                data: { breadcrumb: $localize`Inbox` },
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import('./views/core/mail/mail.app.module').then(
                        (m) => m.MailAppModule,
                    ),
            },
            {
                path: 'organization/:slug/files',
                data: { breadcrumb: $localize`Home` },
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import('./views/core/file/file.app.module').then(
                        (m) => m.FileAppModule,
                    ),
            },

            {
                path: 'organization/:slug/dashboards',
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import('./views/dashboards/dashboards.module').then(
                        (m) => m.DashboardsModule,
                    ),
            },

            {
                path: 'organization/:slug',
                data: { breadcrumb: $localize`My Organization` },
                canActivate: [AuthenticatedGuard],
                loadChildren: () =>
                    import('./views/organization/organization.module').then(
                        (m) => m.OrganizationModule,
                    ),
            },

            {
                path: 'help',
                data: { breadcrumb: $localize`Help` },
                loadChildren: () =>
                    import('./views/help/help.module').then(
                        (m) => m.HelpModule,
                    ),
            },
            {
                path: 'settings',
                data: { breadcrumb: $localize`Settings` },
                loadChildren: () =>
                    import('./views/settings/settings.module').then(
                        (m) => m.SettingsModule,
                    ),
            },

            {
                path: '',
                loadChildren: () =>
                    import('./views/home/home.module').then(
                        (m) => m.HomeModule,
                    ),
            },
        ],
    },

    // These routes do not use app layout

    {
        path: 'block-not-found',
        data: {
            title: $localize`Block Not Found`,
            message: $localize`Cannot find the block you are looking for`,
            button: $localize`Return To Dashboard`,
        },
        loadChildren: () =>
            import('./views/auth/not-found/not-found.module').then(
                (m) => m.NotFoundModule,
            ),
    },
    {
        path: 'not-found',
        loadChildren: () =>
            import('./views/auth/not-found/not-found.module').then(
                (m) => m.NotFoundModule,
            ),
    },
    {
        path: 'auth',
        data: { breadcrumb: $localize`Auth` },
        loadChildren: () =>
            import('./views/auth/auth.module').then((m) => m.AuthModule),
    },
    {
        path: 'landing',
        loadChildren: () =>
            import('./views/landing/landing.module').then(
                (m) => m.LandingModule,
            ),
    },

    { path: '**', redirectTo: '/not-found' },
];

@NgModule({
    imports: [RouterModule.forRoot(routes, routerOptions)],
    exports: [RouterModule],
    providers: [IsSuperAdminGuard, AuthenticatedGuard],
})
export class AppRoutingModule {}
