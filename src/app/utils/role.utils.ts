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
}

export class RoleUtils {
    static hasRole(user: User, role: Role, organization?: string): boolean {

        if (user.isSuperAdmin) return true;

        return user.roles.some(userRole => {
            if (organization) {
                return RoleUtils.isRoleOrGreater(userRole, role) && userRole.organization === organization;
            } else {
                return RoleUtils.isRoleOrGreater(userRole, role);
            }
        });
    }

    static isRoleOrGreater(userRoleTested: UserRole, roleRequired: Role): boolean {
        return RoleUtils.getRoleHierarchy(userRoleTested.role) >= RoleUtils.getRoleHierarchy(roleRequired);
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
}
