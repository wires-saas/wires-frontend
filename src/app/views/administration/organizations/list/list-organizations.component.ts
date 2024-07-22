import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { Organization, OrganizationService } from '../../../../services/organization.service';


@Component({
    templateUrl: './list-organizations.component.html'
})
export class ListOrganizationsComponent implements OnInit {

    customers: Customer[] = [];

    organizations: Organization[] = [];

    constructor(private customerService: CustomerService, private organizationService: OrganizationService, private router: Router) { }

    async ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => this.customers = customers);
        this.organizations = await this.organizationService.getAll();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    navigateToCreateOrganization(){
        this.router.navigate(['administration/organizations/create'])
    }

}
