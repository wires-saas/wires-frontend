import { Component, DestroyRef, inject, OnDestroy, OnInit } from '@angular/core';
import { Organization, OrganizationService } from '../services/organization.service';
import { AuthService } from '../services/auth.service';
import { Role } from '../utils/role.utils';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html'
})
export class AppMenuComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

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

    private organizationMenu: (org: Organization, authService: AuthService) => any[] = (org, authService) => ([
        {
            label: 'Organization',
            icon: 'pi pi-fw pi-building',
            restriction: authService.hasRole$(Role.MANAGER, org.slug),
            items: [
                {
                    label: 'All Users',
                    icon: 'pi pi-fw pi-users',
                    routerLink: [`organization/${org.slug}/users/list`],
                    restriction: authService.hasRole$(Role.MANAGER, org.slug)
                },
                {
                    label: 'Add User',
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: [`organization/${org.slug}/users/create`],
                    restriction: authService.hasRole$(Role.MANAGER, org.slug)
                },
                {
                    label: 'Information',
                    icon: 'pi pi-fw pi-building',
                    routerLink: [`organization/${org.slug}/information`],
                    restriction: authService.hasRole$(Role.ADMIN, org.slug)
                },
                {
                    label: 'Billing',
                    icon: 'pi pi-fw pi-wallet',
                    routerLink: [`organization/${org.slug}/billing`],
                    restriction: authService.hasRole$(Role.ADMIN, org.slug)
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

    private superAdminMenu: (authService: AuthService) => any[] = (authService) => ([
        {
            label: 'Administration',
            icon: 'pi pi-fw pi-shield',
            restriction: authService.hasRole$(Role.SUPER_ADMIN),
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
    ]);

    constructor(private organizationService: OrganizationService, private authService: AuthService) { }

    ngOnInit() {
        this.buildMenu(this.authService);

        this.organizationService.currentOrganization$.pipe(
            map((org) => {
                console.log('buildingMenuForOrganization');
                if (org) {
                    this.buildMenuForOrganization(org, this.authService);
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    buildMenu(authService: AuthService) {
        this.model = [
            ...this.helpMenu,
            ...this.superAdminMenu(authService)
        ];
    }

    buildMenuForOrganization(org: Organization, authService: AuthService) {
        this.model = [
            ...this.dashboardMenu(org),
            ...this.organizationMenu(org, authService),
            ...this.helpMenu,
            ...this.superAdminMenu(authService)
        ];
    }
}
