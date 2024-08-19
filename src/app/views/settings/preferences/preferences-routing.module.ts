import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { PreferencesComponent } from './preferences.component';

@NgModule({
    imports: [RouterModule.forChild([
        { path: '', component: PreferencesComponent }
    ])],
    exports: [RouterModule]
})
export class PreferencesRoutingModule { }
