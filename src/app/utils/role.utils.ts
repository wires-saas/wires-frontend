import { User } from '../services/user.service';
import { Permission, PermissionAction } from '../services/permission.service';

export interface UserRole {
    organization: string;
    user: string;
    role: string;
    permissions: Permission[];
}

export enum RoleName {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MANAGER = 'manager',
    USER = 'user',
    GUEST = 'guest',
}

export type ExtendedRoleName = RoleName | string;

export class RoleUtils {
    static hasRole(user: User, role: RoleName, organization?: string): boolean {
        if (user.isSuperAdmin) return true;

        return user.roles.some((userRole) => {
            if (organization) {
                return (
                    RoleUtils.isRoleOrGreater(userRole.role as RoleName, role) &&
                    userRole.organization === organization
                );
            } else {
                return RoleUtils.isRoleOrGreater(userRole.role as RoleName, role);
            }
        });
    }

    static hasPermission(
        user: User,
        permission: Permission,
        organization?: string,
    ): boolean {
        if (user.isSuperAdmin) return true;

        return user.roles.some((userRole: UserRole) => {
            if (organization) {
                return (
                    userRole.organization === organization &&
                    userRole.permissions?.find(p => p.action === permission.action && p.subject === permission.subject)
                );
            } else {
                return userRole.permissions?.find(p => p.action === permission.action && p.subject === permission.subject);
            }
        });
    }

    static isRoleOrGreater(roleTested: RoleName, roleRequired: RoleName): boolean {
        return (
            RoleUtils.getRoleHierarchy(roleTested) >=
            RoleUtils.getRoleHierarchy(roleRequired)
        );
    }

    static getRoleHierarchy(role: RoleName): number {
        switch (role) {
            case RoleName.SUPER_ADMIN:
                return 4;
            case RoleName.ADMIN:
                return 3;
            case RoleName.MANAGER:
                return 2;
            case RoleName.USER:
                return 1;
            default:
                return 0;
        }
    }

    static getRoleForOrganization(user: User, organizationSlug?: string): RoleName {
        if (user?.isSuperAdmin) return RoleName.SUPER_ADMIN;

        if (user?.roles?.length) {
            if (organizationSlug)
                return (
                    user.roles.find((_) => _.organization === organizationSlug)
                        ?.role as RoleName || RoleName.GUEST
                );
            else return user.roles[0].role as RoleName;
        }

        return RoleName.GUEST;
    }

    static convertManagePermissions(permissions: Permission[]): Permission[] {
        // Maybe this would be more relevant in server side
        return permissions.reduce(
            (acc: Permission[], permission: Permission): Permission[] => {

                if (permission.action === PermissionAction.Manage) {
                    const implicits = [
                        PermissionAction.Create,
                        PermissionAction.Read,
                        PermissionAction.Update,
                        PermissionAction.Delete
                    ];

                    return [
                        ...acc,
                        ...implicits.map(
                            (implicit) => new Permission(permission.subject, implicit)
                        ),
                    ];
                }

                return [...acc, permission];
            },
            [],
        );
    }
}
