import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RippleModule } from 'primeng/ripple';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule } from 'primeng/table';
import { ProgressBarModule } from 'primeng/progressbar';
import { ListUsersComponent } from './list-users.component';
import { ListUsersRoutingModule } from './list-users-routing.module';
import { MenuModule } from 'primeng/menu';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ToastModule } from 'primeng/toast';
import { RolePipe } from '../../../../utils/pipes/role.pipe';
import { StatusPipe } from '../../../../utils/pipes/status.pipe';

@NgModule({
    imports: [
        CommonModule,
        ListUsersRoutingModule,
        RippleModule,
        ButtonModule,
        InputTextModule,
        TableModule,
        ProgressBarModule,
        MenuModule,
        ConfirmDialogModule,
        ToastModule,
        RolePipe,
        StatusPipe
    ],
	declarations: [ListUsersComponent]
})
export class ListUsersModule { }
