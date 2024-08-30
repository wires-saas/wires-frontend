import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [
        RouterModule.forChild([
            {
                path: 'profile',
                loadChildren: () =>
                    import('./profile/profile.module').then(
                        (m) => m.ProfileModule,
                    ),
            },
            {
                path: 'preferences',
                loadChildren: () =>
                    import('./preferences/preferences.module').then(
                        (m) => m.PreferencesModule,
                    ),
            },
            { path: '**', redirectTo: '/not-found' },
        ]),
    ],
    exports: [RouterModule],
})
export class SettingsRoutingModule {}
