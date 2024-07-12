import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { OverviewDashboardComponent } from './overview.dashboard.component';

@NgModule({
	imports: [RouterModule.forChild([
		{ path: '', component: OverviewDashboardComponent }
	])],
	exports: [RouterModule]
})
export class OverviewDashboardRoutingModule { }
