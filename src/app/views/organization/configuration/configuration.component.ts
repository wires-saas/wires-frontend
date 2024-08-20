import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CountriesUtils } from '../../../utils/countries.utils';
import { Organization, OrganizationContact, OrganizationService } from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { deepEquals } from '../../../utils/deep-equals';
import { MessageUtils } from '../../../utils/message.utils';
import { MessageService } from 'primeng/api';
import { Permission, PermissionService } from '../../../services/permission.service';
import { Role } from '../../../utils/role.utils';
import { User, UserService } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';

interface OrganizationSecurity {
    twoFactorAuthenticationEnabled: boolean;
    twoFactorAuthenticationMethods: string[];
}



@Component({
    templateUrl: './configuration.component.html'
})
export class ConfigurationComponent implements OnInit {

    permissionsList: any[] = [];
    permissionsForm: FormGroup = new FormGroup({});

    roleNamesForm: FormGroup = new FormGroup({});

    permissionsRoles: Role[] = [];

    optionsFor2FA= [
        { name: $localize `Email`, id: "email" },
        { name: $localize `SMS (not yet implemented)`, id: "sms", disabled: true },
    ];

    securityForm: FormGroup = new FormGroup({
        twoFactorAuthenticationEnabled: new FormControl(false),
        twoFactorAuthenticationMethods: new FormControl([]),
    });
    securitySavedState: OrganizationSecurity | undefined;

    currentOrgSlug: string | undefined;
    public currentUser: User | undefined = undefined;

    private destroyRef = inject(DestroyRef);

    constructor(private permissionService: PermissionService,
                private organizationService: OrganizationService,
                private authService: AuthService,
                private messageService: MessageService) {
    }

    async ngOnInit() {

        this.organizationService.currentOrganization$.pipe(
            map(async (organization: Organization | undefined) => {
                this.currentOrgSlug = organization?.slug;
                if (organization) {
                    // Populating form fields


                    Object.entries(organization.security).forEach(([key, value]) => {
                        if (this.securityForm.get(key)) {
                            this.securityForm.get(key)?.setValue(value);
                        }
                    });

                    this.securitySavedState = this.securityForm.value;

                    // TODO fetch permissions
                    const rolesWithPermissions = await this.permissionService.getRoles(organization.slug);

                    this.permissionsList = await this.permissionService.getPermissions(organization.slug);

                    this.currentUser = await firstValueFrom(this.authService.currentUser$);
                    const isSuperAdmin = !!this.currentUser?.isSuperAdmin;
                    this.buildPermissionsForm(rolesWithPermissions, isSuperAdmin, isSuperAdmin);

                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

    }

    private buildPermissionsForm(rolesWithPermissions: Record<Role, Permission[]>, canUpdateRoleName: boolean, canUpdatePermissions: boolean) {

        let permissionsControls: any = {};
        Object.entries(rolesWithPermissions).forEach(([role, permissions]) => {
            permissionsControls[role] = new FormControl({ value: permissions, disabled: !canUpdatePermissions });
        });

        let roleNamesControls: any = {};
        Object.keys(rolesWithPermissions).forEach((role) => {
            roleNamesControls[role] = new FormControl({ value: '', disabled: !canUpdateRoleName });
        });

        this.permissionsRoles = Object.keys(rolesWithPermissions) as Role[];

        this.permissionsForm = new FormGroup(permissionsControls);
        this.roleNamesForm = new FormGroup(roleNamesControls);
    }

    canSavePermissions() {
        return (this.permissionsForm.valid
            && this.permissionsForm.dirty) || (this.roleNamesForm.valid && this.roleNamesForm.dirty);
    }

    canSaveSecurity() {
        return this.securityForm.valid
            && this.securityForm.dirty
            && !deepEquals(this.securityForm.value, this.securitySavedState);
    }


    async updateSecurity() {
        if (!this.currentOrgSlug) throw new Error('cannot update organization without slug');
        await this.organizationService.update(this.currentOrgSlug, {
            security: this.securityForm.value
        }).then(() => {

            this.securitySavedState = this.securityForm.value;

            this.messageService.add({
                severity: 'info',
                detail: $localize `Security settings updated successfully`,
                life: 3000,
            });

        }).catch((err) => {
            console.error(err);

            MessageUtils.parseServerError(this.messageService, err, {
                summary: $localize `Error updating security settings`,
            });
        });
    }

}
