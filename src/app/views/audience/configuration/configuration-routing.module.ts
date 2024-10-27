import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AudienceConfigurationComponent } from './configuration.component';
import { ContactsProviderComponent } from './contacts-providers/contacts-provider/contacts-provider.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AudienceConfigurationComponent },
            { path: 'contacts-providers/:providerId', component: ContactsProviderComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
