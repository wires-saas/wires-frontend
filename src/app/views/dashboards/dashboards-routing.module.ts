import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';

@NgModule({
    imports: [RouterModule.forChild([
        { path: 'overview', data: {breadcrumb: $localize `Statistics`}, loadChildren: () => import('./overview/overview.dashboard.module').then(m => m.OverviewDashboardModule) },
        { path: 'blank', data: {breadcrumb: $localize `Empty Dashboard`}, loadChildren: () => import('./blank/blank.module').then(m => m.BlankModule) },
        { path: '', redirectTo: 'overview', pathMatch: 'full' }
    ])],
    exports: [RouterModule]
})
export class DashboardsRoutingModule { }
