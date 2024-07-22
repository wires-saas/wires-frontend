import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { User, UserService } from '../../../../services/user.service';

@Component({
    templateUrl: './list-users.component.html'
})
export class ListUsersComponent implements OnInit {

    customers: Customer[] = [];

    users: User[] = [];

    constructor(private customerService: CustomerService, private userService: UserService, private router: Router) { }

    async ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => this.customers = customers);

        this.users = await this.userService.getUsers();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    navigateToCreateUser(){
        this.router.navigate(['organization/users/create'])
    }

}
