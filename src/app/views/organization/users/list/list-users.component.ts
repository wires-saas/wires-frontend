import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { User, UserService, UserStatus } from '../../../../services/user.service';
import { OrganizationService } from '../../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { filter, firstValueFrom } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService, SortEvent } from 'primeng/api';
import { Role, RoleUtils } from '../../../../utils/role.utils';
import { Slug } from '../../../../utils/types.utils';
import { AuthService } from '../../../../services/auth.service';
import { MessageUtils } from '../../../../utils/message.utils';

@Component({
    templateUrl: './list-users.component.html'
})
export class ListUsersComponent implements OnInit {

    customers: Customer[] = [];

    users: User[] = [];

    actionsMenuItems: MenuItem[] = [];

    multiOrganizations: boolean = false;

    currentOrgSlug: Slug | undefined;

    now: number = Date.now();

    private destroyRef = inject(DestroyRef);

    constructor(private customerService: CustomerService,
                private authService: AuthService,
                private userService: UserService,
                private organizationService: OrganizationService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,
                private route: ActivatedRoute,
                private router: Router) { }

    async ngOnInit() {
        this.customerService.getCustomersLarge().then(customers => this.customers = customers);

        this.multiOrganizations = !!this.route.snapshot.data['multiOrganizations'];

        this.organizationService.currentOrganization$.pipe(
            filter(org => !!org),
            map(async (org) => {
                this.currentOrgSlug = org?.slug;
                if (org?.slug && !this.multiOrganizations) {
                    this.users = await this.userService.getUsers([org.slug]);
                } else {
                    this.users = await this.userService.getUsers();
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    async navigateToCreateUser(){
        if (this.multiOrganizations) {
            await this.router.navigate(['administration/organizations/users/create']);
        } else {
            await this.router.navigate(['users', 'create']);
        }
    }

    getRoleOfUser(user: User): Role {
        if (user?.isSuperAdmin) return Role.SUPER_ADMIN;

        if (user?.roles?.length) {
            if (this.currentOrgSlug) return user.roles.find(_ => _.organization === this.currentOrgSlug)?.role || Role.GUEST;
            else return user.roles[0].role;
        }

        return Role.GUEST;
    }

    isInviteExpired(user: User): boolean {
        if (user?.status !== UserStatus.PENDING) return false;
        else return user.inviteTokenExpiresAt < this.now;
    }

    async toggleMenuFor(user: User, menu: any, event: Event) {

        const currentUser = await firstValueFrom(this.authService.currentUser$);

        if (!currentUser) throw new Error('No current user');

        const currentUserRole = this.getRoleOfUser(currentUser);

        const role = this.getRoleOfUser(user);

        const isCurrentUser = currentUser._id === user._id;

        const visibleForManagersOrAdmins = !isCurrentUser && (currentUserRole === Role.ADMIN || currentUserRole === Role.MANAGER || currentUserRole === Role.SUPER_ADMIN);


        this.actionsMenuItems = [
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['/organization', this.currentOrgSlug, 'users', user._id, 'edit']
            },
            {
                label: 'Re-send Invite',
                icon: 'pi pi-fw pi-envelope',
                visible: visibleForManagersOrAdmins,
                command: () => {
                    if (!this.currentOrgSlug) throw new Error('No current organization slug');
                    this.userService.resendInvite(user._id).then(() => {
                        this.messageService.add({
                            severity: 'success',
                            summary: 'Success re-sending invite',
                            detail: 'User has been invited again',
                            life: 5000,
                        });
                    }).catch((err) => {
                        console.error(err);

                        MessageUtils.parseServerError(this.messageService, err, {
                            summary: 'Error re-sending invite',
                        });
                    });
                }
            },
            {
                label: 'Remove',
                icon: 'pi pi-fw pi-user-minus',
                visible: visibleForManagersOrAdmins,
                command: () => {
                    this.confirmationService.confirm({
                        key: 'confirm-delete',
                        accept: async() => {
                            if (!this.currentOrgSlug) throw new Error('No current organization slug');
                            await this.userService.deleteUser(user._id, this.currentOrgSlug).then(() => {
                                this.users = this.users.filter(_ => _.email !== user.email);

                                this.messageService.add({
                                    severity: 'success',
                                    summary: 'Success removing user',
                                    detail: 'User has been removed from your organization',
                                    life: 5000,

                                });

                            }).catch((err) => {
                                console.error(err);

                                MessageUtils.parseServerError(this.messageService, err, {
                                    summary: 'Error removing user',
                                });
                            });
                        }
                    });
                }
            },
            { separator: true, visible: !isCurrentUser },
            { label: 'Set Admin', icon: 'pi pi-fw pi-sort-up', visible: !isCurrentUser, data: 'admin' },
            { label: 'Set Manager', icon: 'pi pi-fw pi-sort', visible: !isCurrentUser, data: 'manager' },
            { label: 'Set User', icon: 'pi pi-fw pi-sort-down', visible: !isCurrentUser, data: 'user' },
        ];

        this.actionsMenuItems
            .filter(_ => !!_['data'])
            .forEach(_ => {
                // Disabling possibility to set same role user already has
                _.disabled = (role === _['data'])

                if (currentUserRole === Role.MANAGER) {
                    if (_['data'] === Role.ADMIN) {
                        _.visible = false;
                    }
                }
            });

        menu.toggle(event);

    }


    customSort(event: Required<SortEvent>) {
        return this.sortTableData(event);
    }

    private sortTableData(event: Required<SortEvent>) {
        return event.data.sort((data1, data2) => {
            let value1 = data1[event.field];
            let value2 = data2[event.field];
            let result = null;

            if (value1 == null && value2 != null) result = -1;
            else if (value1 != null && value2 == null) result = 1;
            else if (value1 == null && value2 == null) result = 0;
            else if (event.field === 'roles') {
                result = RoleUtils.getRoleHierarchy(this.getRoleOfUser(data1)) > RoleUtils.getRoleHierarchy(this.getRoleOfUser(data2)) ? 1 : -1;
            }
            else if (typeof value1 === 'string' && typeof value2 === 'string') result = value1.localeCompare(value2);
            else result = value1 < value2 ? -1 : value1 > value2 ? 1 : 0;

            return event.order * result;
        });
    }

}
