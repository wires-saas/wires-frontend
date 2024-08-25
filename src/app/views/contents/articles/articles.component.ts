import { Component } from '@angular/core';
import { Customer, Representative } from 'src/app/demo/api/customer';
import { Product } from 'src/app/demo/api/product';
import { MessageService, ConfirmationService } from 'primeng/api';

interface expandedRows {
    [key: string]: boolean;
}

@Component({
    templateUrl: './articles.component.html',
    providers: [MessageService, ConfirmationService]
})
export class ArticlesComponent {

    customers1: Customer[] = [];

    selectedCustomers1: Customer[] = [];

    selectedCustomer: Customer = {};

    representatives: Representative[] = [];

    statuses: any[] = [];

    products: Product[] = [];

    rowGroupMetadata: any;

    expandedRows: expandedRows = {};

    activityValues: number[] = [0, 100];

    isExpanded: boolean = false;

    idFrozen: boolean = false;

    loading: boolean = true;



}
