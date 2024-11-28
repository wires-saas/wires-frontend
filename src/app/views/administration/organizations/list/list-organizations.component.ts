import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Table } from 'primeng/table';
import {
    Organization,
    OrganizationService,
} from '../../../../services/organization.service';
import { User, UserService } from '../../../../services/user.service';
import { MessageUtils } from '../../../../utils/message.utils';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import {HttpErrorResponse} from "@angular/common/http";

@Component({
    templateUrl: './list-organizations.component.html',
})
export class ListOrganizationsComponent implements OnInit {
    organizations: Organization[] = [];
    users: User[] = [];

    actionsMenuItems: MenuItem[] = [];

    constructor(
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private organizationService: OrganizationService,
        private userService: UserService,
        private router: Router,
    ) {}

    async ngOnInit() {
        this.organizations = await this.organizationService.getAll();
        this.users = await this.userService.getUsers();

        await Promise.all(this.organizations.map(async (org) => {
            try {
                org.plan = await this.organizationService.getPlan(org.slug);
            } catch (err) {
                console.error(err);
                MessageUtils.parseServerError(this.messageService, err as HttpErrorResponse, {
                    summary: $localize`Error loading organization plan`,
                });
            }
        }));

        this.organizations.forEach((org) => {
            org._nbMembers = this.users.filter((user) =>
                user.roles.find((_) => _.organization === org.slug),
            ).length;
        });
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal(
            (event.target as HTMLInputElement).value,
            'contains',
        );
    }

    navigateToCreateOrganization() {
        this.router.navigate(['administration/organizations/create']);
    }

    async toggleMenuFor(organization: Organization, menu: any, event: Event) {
        this.actionsMenuItems = [
            {
                label: $localize`Actions`,
                items: [
                    {
                        label: $localize`Edit information`,
                        icon: 'pi pi-fw pi-pencil',
                        command: () => {
                            this.organizationService.setCurrentOrganization(
                                organization,
                            );
                            this.router.navigate([
                                '/organization',
                                organization.slug,
                                'information',
                            ]);
                        },
                    },
                    {
                        label: $localize`Delete org`,
                        icon: 'pi pi-fw pi-trash',
                        disabled: true,
                        command: () => {
                            this.confirmationService.confirm({
                                key: 'confirm-delete',
                                accept: async () => {
                                    await this.organizationService
                                        .delete(organization.slug)
                                        .then(() => {
                                            this.organizations =
                                                this.organizations.filter(
                                                    (_) =>
                                                        _.slug !==
                                                        organization.slug,
                                                );

                                            this.messageService.add({
                                                severity: 'success',
                                                summary: $localize`Success removing organization`,
                                                detail: $localize`Organization has been removed successfully`,
                                                life: 5000,
                                            });
                                        })
                                        .catch((err) => {
                                            console.error(err);

                                            MessageUtils.parseServerError(
                                                this.messageService,
                                                err,
                                                {
                                                    summary: $localize`Error removing organization`,
                                                },
                                            );
                                        });
                                },
                            });
                        },
                    },
                ],
            },
        ];

        menu.toggle(event);
    }
}
