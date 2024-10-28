import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { AudienceConfigurationComponent } from './configuration.component';
import { ContactsProviderComponent } from './contacts-providers/contacts-provider/contacts-provider.component';
import { EmailsProviderComponent } from './emails-providers/emails-provider/emails-provider.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: AudienceConfigurationComponent },
            {
                path: 'contacts-providers/:providerId',
                component: ContactsProviderComponent,
            },
            {
                path: 'emails-providers/:providerId',
                component: EmailsProviderComponent,
            },
        ]),
    ],
    exports: [RouterModule],
})
export class ConfigurationRoutingModule {}
