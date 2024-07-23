import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Router } from '@angular/router';
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

    multiOrganizations: boolean = false;

    constructor(private customerService: CustomerService,
                private userService: UserService,
                private route: ActivatedRoute,
                private router: Router) { }

    async ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => this.customers = customers);

        this.users = await this.userService.getUsers();

        this.multiOrganizations = !!this.route.snapshot.data['multiOrganizations'];
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    navigateToCreateUser(){
        if (this.multiOrganizations) {
            this.router.navigate(['administration/organizations/users/create']);
        } else {
            this.router.navigate(['organizations/users/create']);
        }
    }

    getUserRole(user: User): string {
        if (user?.roles?.length) return user.roles[0].role;
        else return '';
    }

}
