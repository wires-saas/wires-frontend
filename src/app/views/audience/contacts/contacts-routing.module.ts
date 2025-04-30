import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ContactsComponent } from './contacts.component';
import { UploadComponent } from './upload/upload.component';
@NgModule({
    imports: [
        RouterModule.forChild([{ path: '', component: ContactsComponent }, { path: 'upload', component: UploadComponent }]),
    ],
    exports: [RouterModule],
})
export class ContactsRoutingModule {}
