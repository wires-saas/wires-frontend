import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table } from 'primeng/table';
import { Customer } from 'src/app/demo/api/customer';
import { CustomerService } from 'src/app/demo/service/customer.service';
import { User, UserService } from '../../../../services/user.service';
import { OrganizationService } from '../../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { filter, firstValueFrom } from 'rxjs';
import { MenuItem } from 'primeng/api';
import { Role, RoleUtils } from '../../../../utils/role.utils';
import { Slug } from '../../../../utils/types.utils';
import { AuthService } from '../../../../services/auth.service';

@Component({
    templateUrl: './list-users.component.html'
})
export class ListUsersComponent implements OnInit {

    customers: Customer[] = [];

    users: User[] = [];

    actionsMenuItems: MenuItem[] = [];

    multiOrganizations: boolean = false;

    currentOrgSlug: Slug | undefined;

    private destroyRef = inject(DestroyRef);

    constructor(private customerService: CustomerService,
                private authService: AuthService,
                private userService: UserService,
                private organizationService: OrganizationService,
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

    async toggleMenuFor(user: User, menu: any, event: Event) {

        const currentUser = await firstValueFrom(this.authService.currentUser$);

        if (!currentUser) throw new Error('No current user');

        const currentUserRole = this.getRoleOfUser(currentUser);

        const role = this.getRoleOfUser(user);


        this.actionsMenuItems = [
            {
                label: 'Edit',
                icon: 'pi pi-fw pi-pencil',
                routerLink: ['/organization', this.currentOrgSlug, 'users', user._id, 'edit']
            },
            { label: 'Re-send Invite', icon: 'pi pi-fw pi-envelope' },
            { label: 'Remove', icon: 'pi pi-fw pi-user-minus' },
            { separator: true },
            { label: 'Set Admin', icon: 'pi pi-fw pi-sort-up', data: 'admin' },
            { label: 'Set Manager', icon: 'pi pi-fw pi-sort', data: 'manager' },
            { label: 'Set User', icon: 'pi pi-fw pi-sort-down', data: 'user' },
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

}
