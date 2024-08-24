import { User } from '../services/user.service';

export interface UserRole {
    organization: string;
    user: string;
    role: Role;
}

export enum Role {
    SUPER_ADMIN = 'super_admin',
    ADMIN = 'admin',
    MANAGER = 'manager',
    USER = 'user',
    GUEST = 'guest'
}

export class RoleUtils {
    static hasRole(user: User, role: Role, organization?: string): boolean {

        if (user.isSuperAdmin) return true;

        return user.roles.some(userRole => {
            if (organization) {
                return RoleUtils.isRoleOrGreater(userRole.role, role) && userRole.organization === organization;
            } else {
                return RoleUtils.isRoleOrGreater(userRole.role, role);
            }
        });
    }

    static isRoleOrGreater(roleTested: Role, roleRequired: Role): boolean {
        return RoleUtils.getRoleHierarchy(roleTested) >= RoleUtils.getRoleHierarchy(roleRequired);
    }

    static getRoleHierarchy(role: Role): number {
        switch (role) {
            case Role.SUPER_ADMIN:
                return 4;
            case Role.ADMIN:
                return 3;
            case Role.MANAGER:
                return 2;
            case Role.USER:
                return 1;
            default:
                return 0;
        }
    }

    static getRoleForOrganization(user: User, organizationSlug?: string): Role {
        if (user?.isSuperAdmin) return Role.SUPER_ADMIN;

        if (user?.roles?.length) {
            if (organizationSlug) return user.roles.find(_ => _.organization === organizationSlug)?.role || Role.GUEST;
            else return user.roles[0].role;
        }

        return Role.GUEST;
    }
}
