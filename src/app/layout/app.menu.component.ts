import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    Organization,
    OrganizationService,
} from '../services/organization.service';
import { AuthService } from '../services/auth.service';
import { RoleName } from '../utils/role.utils';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FeedsComponent } from '../views/contents/feeds/feeds.component';
import { ArticlesComponent } from '../views/contents/articles/articles.component';
import { BillingComponent } from '../views/organization/billing/billing.component';
import { ConfigurationComponent } from '../views/organization/configuration/configuration.component';
import { InformationComponent } from '../views/organization/information/information.component';
import { ListUsersComponent } from '../views/organization/users/list/list-users.component';
import { BlocksComponent } from '../views/studio/blocks/blocks.component';
import { AudienceConfigurationComponent } from '../views/audience/configuration/configuration.component';
import { ContactsComponent } from '../views/audience/contacts/contacts.component';
import { DeliveryComponent } from '../views/audience/delivery/delivery.component';
import {TemplatesComponent} from "../views/studio/templates/templates.component";

@Component({
    selector: 'app-menu',
    templateUrl: './app.menu.component.html',
})
export class AppMenuComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    model: any[] = [];

    private dashboardMenu: (
        org: Organization,
        authService: AuthService,
    ) => any[] = (org) => [
        {
            label: 'Dashboards',
            items: [
                {
                    label: $localize`Home`,
                    icon: 'fa-regular fa-house', // 'pi pi-fw pi-home',
                    routerLink: [`/organization/${org.slug}/files`],
                },
                {
                    label: $localize`Inbox`,
                    icon: 'fa-regular fa-envelope', // 'pi pi-fw pi-inbox',
                    routerLink: [`/organization/${org.slug}/mail`],
                    routerLinkActiveOptions: { exact: false },
                },
                {
                    label: $localize`Empty`,
                    icon: 'pi pi-fw pi-circle-off',
                    routerLink: [`/organization/${org.slug}/dashboards/blank`],
                },
                {
                    label: $localize`Stats`,
                    icon: 'fa-regular fa-chart-mixed', // 'pi pi-fw pi-file',
                    routerLink: [
                        `/organization/${org.slug}/dashboards/overview`,
                    ],
                },
            ],
        },
    ];

    private studioMenu: (org: Organization, authService: AuthService) => any[] =
        (org, authService) => [
            {
                label: 'Studio',
                items: [
                    {
                        label: $localize`Blocks`,
                        icon: 'pi pi-fw pi-objects-column',
                        routerLink: [`/organization/${org.slug}/studio/blocks`],
                        routerLinkActiveOptions: { exact: false },
                        restriction: authService.hasAtLeast$(
                            BlocksComponent.permissions,
                            org.slug,
                        ),
                    },
                    {
                        label: $localize`Templates`,
                        icon: 'fa-regular fa-layer-group', // 'pi pi-fw pi-file',
                        routerLink: [
                            `/organization/${org.slug}/studio/templates`,
                        ],
                        routerLinkActiveOptions: { exact: false },
                        restriction: authService.hasAtLeast$(
                            TemplatesComponent.permissions,
                            org.slug,
                        ),
                    },
                ],
            },
        ];

    private audienceMenu: (
        org: Organization,
        authService: AuthService,
    ) => any[] = (org, authService) => [
        {
            label: $localize`Audience`,
            restriction: authService.hasAtLeast$(
                [
                    ...AudienceConfigurationComponent.permissions,
                    ...ContactsComponent.permissions,
                    ...DeliveryComponent.permissions,
                ],
                org.slug,
            ),
            items: [
                {
                    label: $localize`Contacts`,
                    icon: 'fa-light fa-user-group', // 'pi pi-fw pi-address-book',
                    routerLink: [`/organization/${org.slug}/audience/contacts`],
                    /* restriction: authService.hasAtLeast$(
                        ContactsComponent.permissions,
                        org.slug,
                    ), */
                },
                {
                    label: $localize`Delivery`,
                    icon: 'fa-regular fa-envelopes-bulk', // 'pi pi-fw pi-send',
                    routerLink: [`/organization/${org.slug}/audience/delivery`],
                    routerLinkActiveOptions: { exact: false },
                    /* restriction: authService.hasAtLeast$(
                        DeliveryComponent.permissions,
                        org.slug,
                    ), */
                },
                {
                    label: $localize`Configuration`,
                    icon: 'fa-regular fa-cog', // 'pi pi-fw pi-cog',
                    routerLink: [
                        `/organization/${org.slug}/audience/configuration`,
                    ],
                    routerLinkActiveOptions: { exact: false },
                    restriction: authService.hasAtLeast$(
                        AudienceConfigurationComponent.permissions,
                        org.slug,
                    ),
                },
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
                    icon: 'fa-regular fa-newspaper', // 'pi pi-fw pi-box',
                    routerLink: [`/organization/${org.slug}/contents/articles`],
                    restriction: authService.hasAtLeast$(
                        ArticlesComponent.permissions,
                        org.slug,
                    ),
                },
                {
                    label: $localize`Feeds`,
                    icon: 'fa-regular fa-rss', // 'pi pi-fw pi-sitemap',
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
                    icon: 'fa-light fa-users', // 'pi pi-fw pi-users',
                    routerLink: [`organization/${org.slug}/users/list`],
                    restriction: authService.hasAtLeast$(
                        ListUsersComponent.permissions,
                        org.slug,
                    ),
                },
                {
                    label: $localize`Information`,
                    icon: 'fa-regular fa-memo-circle-info', // 'pi pi-fw pi-building',
                    routerLink: [`organization/${org.slug}/information`],
                    restriction: authService.hasAtLeast$(
                        InformationComponent.permissions,
                        org.slug,
                    ),
                },
                {
                    label: $localize`Billing`,
                    icon: 'fa-regular fa-wallet', // 'pi pi-fw pi-wallet',
                    routerLink: [`organization/${org.slug}/billing`],
                    restriction: authService.hasAtLeast$(
                        BillingComponent.permissions,
                        org.slug,
                    ),
                },
                {
                    label: $localize`Configuration`,
                    icon: 'fa-regular fa-gear', // 'pi pi-fw pi-cog',
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
            restriction: authService.hasRole$(RoleName.SUPER_ADMIN),
            items: [
                {
                    label: $localize`All Organizations`,
                    icon: 'fa-regular fa-buildings', // 'pi pi-fw pi-list',
                    routerLink: ['administration/organizations/list'],
                },
                {
                    label: $localize`Add Organization`,
                    icon: 'pi pi-fw pi-plus',
                    routerLink: ['administration/organizations/create'],
                },
                {
                    label: $localize`All Users`,
                    icon: 'fa-light fa-users', // 'pi pi-fw pi-users',
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
            ...this.dashboardMenu(org, authService),
            ...this.studioMenu(org, authService),
            ...this.audienceMenu(org, authService),
            ...this.contentsMenu(org, authService),
            ...this.organizationMenu(org, authService),
            ...this.helpMenu,
            ...this.superAdminMenu(authService),
        ];
    }
}
