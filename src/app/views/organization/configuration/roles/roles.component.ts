import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { RoleName } from '../../../../utils/role.utils';
import { User } from '../../../../services/user.service';
import { Permission, PermissionService, RolePermissions } from '../../../../services/permission.service';
import { Organization, OrganizationService } from '../../../../services/organization.service';
import { AuthService } from '../../../../services/auth.service';
import { ConfirmationService, MessageService } from 'primeng/api';
import { map } from 'rxjs/operators';
import { firstValueFrom } from 'rxjs';
import { UpdateRole } from '../../../../utils/permission.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Slug } from '../../../../utils/types.utils';
import { MessageUtils } from '../../../../utils/message.utils';

@Component({
    selector: 'app-roles',
    templateUrl: './roles.component.html',
})
export class RolesComponent implements OnInit {
    permissionsList: any[] = [];
    permissionsForm: FormGroup = new FormGroup({});

    roleNamesForm: FormGroup = new FormGroup({});

    permissionsRoles: RoleName[] = [];

    loading: boolean = false;

    canUpdateRole: boolean = false;
    canCreateRole: boolean = false;

    currentOrgSlug: string | undefined;
    public currentUser: User | undefined = undefined;

    private destroyRef = inject(DestroyRef);

    constructor(
        private confirmationService: ConfirmationService,
        private permissionService: PermissionService,
        private organizationService: OrganizationService,
        private authService: AuthService,
        private messageService: MessageService,
    ) {}

    async ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map(async (organization: Organization | undefined) => {
                    this.currentOrgSlug = organization?.slug;
                    if (organization) {
                        // Populating form fields
                        await this.load(organization.slug);
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private async load(organizationSlug: Slug) {
        const rolesWithPermissions =
            await this.permissionService.getRoles(organizationSlug);

        this.permissionsList =
            await this.permissionService.getPermissions();

        this.currentUser = await firstValueFrom(
            this.authService.currentUser$,
        );

        this.canUpdateRole = await firstValueFrom(this.authService.hasPermission$(UpdateRole));

        this.buildPermissionsForm(
            rolesWithPermissions,
            this.canUpdateRole,
        );
    }

    private buildPermissionsForm(
        rolesWithPermissions: Record<RoleName, Permission[]>,
        canUpdateRole: boolean,
    ) {
        const permissionsControls: any = {};
        Object.entries(rolesWithPermissions).forEach(([role, permissions]) => {
            permissionsControls[role] = new FormControl({
                value: permissions,
                disabled: !canUpdateRole,
            });
        });

        const roleNamesControls: any = {};
        Object.keys(rolesWithPermissions).forEach((role) => {
            roleNamesControls[role] = new FormControl({
                value: '',
                disabled: !canUpdateRole,
            }, [Validators.pattern(/^[a-zA-Z]*$/)]);
        });

        this.permissionsRoles = Object.keys(rolesWithPermissions) as RoleName[];

        this.permissionsForm = new FormGroup(permissionsControls);
        this.roleNamesForm = new FormGroup(roleNamesControls);
    }

    canSavePermissions() {
        return (
            (this.permissionsForm.valid && this.permissionsForm.dirty) ||
            (this.roleNamesForm.valid && this.roleNamesForm.dirty)
        );
    }

    private getRoles(): RolePermissions[] {
        const roles: RolePermissions[] = Object.entries(this.permissionsForm.value).map(([role, permissions]: [string, any]) => {
            return {
                name: role as RoleName,
                permissions: permissions.map((permission: Permission) => {
                    return {
                        _id: `${permission.action}_${permission.subject}`,
                        subject: permission.subject,
                        action: permission.action,
                    };
                }),
            };
        });

        roles.forEach((role) => {
            const roleNameChanged = this.roleNamesForm.get(role.name)?.value;
            if (roleNameChanged) {
                role.previousName = role.name;
                role.name = roleNameChanged.toLowerCase().trim();
            }
        });

        return roles;
    }

    async openUpdateRolesDialog() {
        if (!this.currentOrgSlug) return;

        const organizationSlug = this.currentOrgSlug;
        const rolesForBackend = this.getRoles();

        const onConfirm = () => {
            this.loading = true;
            this.permissionService.updateRoles(organizationSlug, rolesForBackend).then(async () => {
                this.messageService.add({
                    key: 'roles',
                    severity: 'success',
                    summary: 'Success',
                    detail: 'Roles updated successfully'
                });

                await this.load(organizationSlug);
                this.loading = false;
            }).catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(
                    this.messageService,
                    err,
                    {
                        summary: $localize`Error updating roles`,
                    },
                );

                this.loading = false;
            });
        }

        this.confirmationService.confirm({
            key: 'confirm-update-roles',
            accept: onConfirm,
        });

    }

}
