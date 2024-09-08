import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    Organization,
    OrganizationService,
} from '../services/organization.service';
import { AuthService } from '../services/auth.service';
import { Role } from '../utils/role.utils';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeedsComponent } from '../views/contents/feeds/feeds.component';
import { ArticlesComponent } from '../views/contents/articles/articles.component';
import { BillingComponent } from '../views/organization/billing/billing.component';
import { ConfigurationComponent } from '../views/organization/configuration/configuration.component';
import { InformationComponent } from '../views/organization/information/information.component';
import { ListUsersComponent } from '../views/organization/users/list/list-users.component';

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    model: any[] = [];

    private dashboardMenu: () => any[] = () => [
        {
            label: 'Dashboards',
            items: [
                {
                    label: $localize`Home`,
                    icon: 'pi pi-fw pi-home',
                    routerLink: ['/files'],
                },
                {
                    label: $localize`Inbox`,
                    icon: 'pi pi-fw pi-inbox',
                    routerLink: ['/mail'],
                    routerLinkActiveOptions: { exact: false },
                },
                {
                    label: $localize`Empty`,
                    icon: 'pi pi-fw pi-circle-off',
                    routerLink: ['/blank'],
                },
                {
                    label: $localize `Studio`,
                    icon: 'pi pi-fw pi-objects-column',
                    routerLink: ['/studio']
                },
                /* {
                    label: $localize `Overview`,
                    icon: 'pi pi-fw pi-file',
                    routerLink: ['/overview']
                } */
            ],
        },
    ];

    private contentsMenu: (
        org: Organization,
        authService: AuthService,
    ) => any[] = (org, authService) => [
        {
            label: $localize`Contents`,
            restriction: authService.hasAtLeast$(
                [
                    ...FeedsComponent.permissions,
                    ...ArticlesComponent.permissions,
                ],
                org.slug,
            ),
            items: [
                {
                    label: $localize`Articles`,
                    icon: 'pi pi-fw pi-box',
                    routerLink: [`/organization/${org.slug}/contents/articles`],
                    restriction: authService.hasAtLeast$(
                        ArticlesComponent.permissions,
                        org.slug,
                    ),
                },
                {
                    label: $localize`Feeds`,
                    icon: 'pi pi-fw pi-sitemap',
                    routerLink: [`/organization/${org.slug}/contents/feeds`],
                    routerLinkActiveOptions: { exact: false },
                    restriction: authService.hasAtLeast$(
                        FeedsComponent.permissions,
                        org.slug,
                    ),
                },
            ],
        },
    ];

    private organizationMenu: (
        org: Organization,
        authService: AuthService,
    ) => any[] = (org, authService) => [
        {
            label: $localize`Organization`,
            restriction: authService.hasAtLeast$(
                [
                    ...BillingComponent.permissions,
                    ...ConfigurationComponent.permissions,
                    ...InformationComponent.permissions,
                    ...ListUsersComponent.permissions,
                ],
                org.slug,
            ),
            items: [
                {
                    label: $localize`All Users`,
                    icon: 'pi pi-fw pi-users',
                    routerLink: [`organization/${org.slug}/users/list`],
                    restriction: authService.hasAtLeast$(
                        ListUsersComponent.permissions,
                        org.slug,
                    ),
                },
                /* {
                    label: $localize `Add User`,
                    icon: 'pi pi-fw pi-user-plus',
                    routerLink: [`organization/${org.slug}/users/create`],
                    restriction: authService.hasRole$(Role.MANAGER, org.slug)
                }, */
                {
                    label: $localize`Information`,
                    icon: 'pi pi-fw pi-building',
                    routerLink: [`organization/${org.slug}/information`],
                    restriction: authService.hasAtLeast$(
                        InformationComponent.permissions,
                        org.slug,
                    ),
                },
                {
                    label: $localize`Billing`,
                    icon: 'pi pi-fw pi-wallet',
                    routerLink: [`organization/${org.slug}/billing`],
                    restriction: authService.hasAtLeast$(
                        BillingComponent.permissions,
                        org.slug,
                    ),
                },
                {
                    label: $localize`Configuration`,
                    icon: 'pi pi-fw pi-cog',
                    routerLink: [`organization/${org.slug}/configuration`],
                    restriction: authService.hasAtLeast$(
                        ConfigurationComponent.permissions,
                        org.slug,
                    ),
                },
            ],
        },
    ];

    private helpMenu: any[] = [
        {
            label: $localize`Help`,
            icon: 'pi pi-fw pi-th-large',
            items: [
                {
                    label: $localize`FAQ`,
                    icon: 'pi pi-fw pi-question-circle',
                    routerLink: ['/help/faq'],
                },
                {
                    label: $localize`Contact Us`,
                    icon: 'pi pi-fw pi-phone',
                    routerLink: ['/help/contact'],
                },
            ],
        },
    ];

    private superAdminMenu: (authService: AuthService) => any[] = (
        authService,
    ) => [
        {
            label: $localize`Administration`,
            icon: 'pi pi-fw pi-shield',
            restriction: authService.hasRole$(Role.SUPER_ADMIN),
            items: [
                {
                    label: $localize`All Organizations`,
                    icon: 'pi pi-fw pi-list',
                    routerLink: ['administration/organizations/list'],
                },
                {
                    label: $localize`Add Organization`,
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['administration/organizations/create'],
                },
                {
                    label: $localize`All Users`,
                    icon: 'pi pi-fw pi-users',
                    routerLink: ['administration/organizations/users/list'],
                },
            ],
        },
    ];

    constructor(
        private organizationService: OrganizationService,
        private authService: AuthService,
    ) {}

    ngOnInit() {
        this.buildMenu(this.authService);

        this.organizationService.currentOrganization$
            .pipe(
                map((org) => {
                    if (org) {
                        this.buildMenuForOrganization(org, this.authService);
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    buildMenu(authService: AuthService) {
        this.model = [...this.helpMenu, ...this.superAdminMenu(authService)];
    }

    buildMenuForOrganization(org: Organization, authService: AuthService) {
        this.model = [
            ...this.dashboardMenu(),
            ...this.contentsMenu(org, authService),
            ...this.organizationMenu(org, authService),
            ...this.helpMenu,
            ...this.superAdminMenu(authService),
        ];
    }
}
