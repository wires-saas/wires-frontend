import { OnInit } from '@angular/core';
import { Component } from '@angular/core';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    ngOnInit() {
        this.model = [
            {
                label: 'Dashboards',
                icon: 'pi pi-home',
                items: [
                    {
                        label: 'Overview',
                        icon: 'pi pi-fw pi-home',
                        routerLink: ['/overview']
                    },
                    {
                        label: 'Blank',
                        icon: 'pi pi-fw pi-circle-off',
                        routerLink: ['/blank']
                    },
                ]
            },
            {
                label: 'Organization',
                icon: 'pi pi-fw pi-building',
                items: [
                    {
                        label: 'All Users',
                        icon: 'pi pi-fw pi-users',
                        routerLink: ['organization/users/list']
                    },
                    {
                        label: 'Add User',
                        icon: 'pi pi-fw pi-user-plus',
                        routerLink: ['organization/users/create']
                    },
                    {
                        label: 'Information',
                        icon: 'pi pi-fw pi-building',
                        routerLink: ['organization/information']
                    },
                    {
                        label: 'Billing',
                        icon: 'pi pi-fw pi-wallet',
                        routerLink: ['organization/billing']
                    },

                ]
            },
            {
                label: 'Help',
                icon: 'pi pi-fw pi-th-large',
                items: [
                    {
                        label: 'FAQ',
                        icon: 'pi pi-fw pi-question-circle',
                        routerLink: ['/help/faq']
                    },
                    {
                        label: 'Contact Us',
                        icon: 'pi pi-fw pi-phone',
                        routerLink: ['/help/contact']
                    }
                ]
            },
            {
                label: 'Administration',
                icon: 'pi pi-fw pi-shield',
                items: [
                    {
                        label: 'All Organizations',
                        icon: 'pi pi-fw pi-list',
                        routerLink: ['administration/organizations/list']
                    },
                    {
                        label: 'Add Organization',
                        icon: 'pi pi-fw pi-plus',
                        routerLink: ['administration/organizations/create']
                    },
                ]
            },
        ];
    }
}
