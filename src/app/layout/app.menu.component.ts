import { OnInit } from '@angular/core';
import { Component } from '@angular/core';
import { Organization, OrganizationService } from '../services/organization.service';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    model: any[] = [];

    private dashboardMenu: (org: Organization) => any[] = (org) => ([
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
        }
    ]);

    private organizationMenu: (org: Organization) => any[] = (org) => ([
        {
            label: 'Organization',
            icon: 'pi pi-fw pi-building',
            items: [
                {
                    label: 'All Users',
                    icon: 'pi pi-fw pi-users',
                    routerLink: [`organization/${org.slug}/users/list`]
                },
                {
                    label: 'Add User',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: [`organization/${org.slug}/users/create`]
                },
                {
                    label: 'Information',
                    icon: 'pi pi-fw pi-building',
                    routerLink: [`organization/${org.slug}/information`]
                },
                {
                    label: 'Billing',
                    icon: 'pi pi-fw pi-wallet',
                    routerLink: [`organization/${org.slug}/billing`]
                },

            ]
        }
    ]);

    private helpMenu: any[] = [
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
        }
    ];

    private superAdminMenu: any[] = [
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
                {
                    label: 'All Users',
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['administration/organizations/users/list']
                },
                {
                    label: 'Add User',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: ['administration/organizations/users/create']
                },
            ]
        }
    ];

    constructor(private organizationService: OrganizationService) { }

    ngOnInit() {
        this.buildMenu();

        this.organizationService.currentOrganization$.subscribe((org) => {
            if (org) this.buildMenuForOrganization(org);
        });
    }

    buildMenu() {
        this.model = [
            ...this.helpMenu,
            ...this.superAdminMenu
        ];
    }

    buildMenuForOrganization(org: Organization) {
        this.model = [
            ...this.dashboardMenu(org),
            ...this.organizationMenu(org),
            ...this.helpMenu,
            ...this.superAdminMenu
        ];
    }
}
