import { AfterViewInit, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { User, UserService, UserStatus } from '../../../../services/user.service';
import { OrganizationService } from '../../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { filter, firstValueFrom, Observable } from 'rxjs';
import { ConfirmationService, MenuItem, MessageService, SortEvent } from 'primeng/api';
import { Role, RoleUtils } from '../../../../utils/role.utils';
import { Slug } from '../../../../utils/types.utils';
import { AuthService } from '../../../../services/auth.service';
import { MessageUtils } from '../../../../utils/message.utils';
import { CsvUtils } from '../../../../utils/csv.utils';

@Component({
    templateUrl: './list-users.component.html'
})
export class ListUsersComponent implements OnInit, AfterViewInit {

    users: User[] = [];

    actionsMenuItems: MenuItem[] = [];

    multiOrganizations: boolean = false;

    currentOrgSlug: Slug | undefined;

    now: number = Date.now();

    showUserInvitedConfirmation: boolean = false;

    private destroyRef = inject(DestroyRef);

    constructor(private authService: AuthService,
                private userService: UserService,
                private organizationService: OrganizationService,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,
                private route: ActivatedRoute,
                private router: Router) {
        const navigation = this.router.getCurrentNavigation()
        if (navigation?.extras?.state?.['userInvited']) this.showUserInvitedConfirmation = true;
    }

    async ngOnInit() {

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

    ngAfterViewInit() {
        if (this.showUserInvitedConfirmation) {
            this.messageService.add({
                severity: 'success',
                summary: $localize `Success inviting user`,
                detail: $localize `User has been invited by email to join !`,
                life: 5000
            });
        }
    }

    onGlobalFilter(table: Table, event: Event) {
        table.filterGlobal((event.target as HTMLInputElement).value, 'contains')
    }

    isCurrentUser(user: User): Observable<boolean> {
        return this.authService.currentUser$.pipe(
            map(_ => _?._id === user._id),
            takeUntilDestroyed(this.destroyRef)
        );
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
                label: $localize `Actions`,
                items: [
                    {
                        label: $localize `Edit`,
                        icon: 'pi pi-fw pi-pencil',
                        routerLink: ['/organization', this.currentOrgSlug, 'users', user._id, 'edit']
                    },
                    {
                        label: $localize `Re-send Invite`,
                        icon: 'pi pi-fw pi-envelope',
                        disabled: user.status !== UserStatus.PENDING,
                        visible: visibleForManagersOrAdmins,
                        command: () => {
                            if (!this.currentOrgSlug) throw new Error('No current organization slug');
                            this.userService.resendInvite(user._id).then(() => {
                                this.messageService.add({
                                    severity: 'success',
                                    summary: $localize `Success re-sending invite`,
                                    detail: $localize `User has been invited again`,
                                    life: 5000,
                                });
                            }).catch((err) => {
                                console.error(err);

                                MessageUtils.parseServerError(this.messageService, err, {
                                    summary: $localize `Error re-sending invite`,
                                });
                            });
                        }
                    },
                    {
                        label: $localize `Remove`,
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
                                            summary: $localize `Success removing user`,
                                            detail: $localize `User has been removed from your organization`,
                                            life: 5000,
                                        });

                                    }).catch((err) => {
                                        console.error(err);

                                        MessageUtils.parseServerError(this.messageService, err, {
                                            summary: $localize `Error removing user`,
                                        });
                                    });
                                }
                            });
                        }
                    }
                ]

            },
            { separator: true, visible: visibleForManagersOrAdmins && !isCurrentUser },
            {
                label: $localize `Roles`,
                visible: visibleForManagersOrAdmins && !isCurrentUser,
                items: [
                    {
                        label: $localize `Set Admin`,
                        icon: 'pi pi-fw pi-sort-up',
                        visible: !isCurrentUser,
                        disabled: this.getRoleOfUser(user) === Role.ADMIN,
                        command: async () => {
                            if (!this.currentOrgSlug) throw new Error('No current organization slug');
                            await this.userService.addUserRole(user._id, this.currentOrgSlug, Role.ADMIN).then(() => {
                                this.users = this.users.map(_ => {
                                    if (_.email === user.email) {
                                        _.roles = _.roles.map(_ => {
                                            if (_.organization === this.currentOrgSlug) _.role = Role.ADMIN;
                                            return _;
                                        });
                                    }
                                    return _;
                                });

                                this.messageService.add({
                                    severity: 'success',
                                    summary: $localize `Success setting role`,
                                    detail: $localize `User has been set as Admin`,
                                    life: 5000,
                                });

                            }).catch((err) => {
                                console.error(err);

                                MessageUtils.parseServerError(this.messageService, err, {
                                    summary: $localize `Error setting role`,
                                });
                            });
                        }
                    },
                    {
                        label: $localize `Set Manager`,
                        icon: 'pi pi-fw pi-sort',
                        visible: !isCurrentUser,
                        disabled: this.getRoleOfUser(user) === Role.MANAGER,
                        data: 'manager'
                    },
                    {
                        label: $localize `Set User`,
                        icon: 'pi pi-fw pi-sort-down',
                        visible: !isCurrentUser,
                        disabled: this.getRoleOfUser(user) === Role.USER,
                        data: 'user'
                    }
                ]
            }
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

    exportUsersToCSV() {
        const fileContent = CsvUtils.jsonToCsv<User>(
            ['firstName', 'lastName', 'email', 'status', 'emailStatus', 'createdAt'],
            this.users,
            ';'
        );

        const blob = new Blob([fileContent], {type: 'text/csv'});
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentOrgSlug}_users.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

}
