import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { ContactsProviderComponent } from './contacts-providers/contacts-provider/contacts-provider.component';

@NgModule({
    imports: [
        RouterModule.forChild([
            { path: '', component: ContactsComponent },
            { path: 'providers/:providerId', component: ContactsProviderComponent },
        ]),
    ],
    exports: [RouterModule],
})
export class ContactsRoutingModule {}
