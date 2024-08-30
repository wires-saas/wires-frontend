import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Role } from '../utils/role.utils';

export enum PermissionAction {
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
    Manage = 'manage',
}

export enum PermissionSubject {
    Organization = 'organization',
    UserRole = 'userRole',
    User = 'user',
    Feed = 'feed',
    FeedRun = 'feedRun',
    Article = 'article',
    Billing = 'billing',
}

export class Permission {
    subject: PermissionSubject;
    action: PermissionAction;

    label: string;

    constructor(subject: PermissionSubject, action: PermissionAction) {
        this.subject = subject;
        this.action = action;

        let customLabel: string = '';

        // Special translations (more explicit)
        if (this.subject === PermissionSubject.FeedRun) {
            if (this.action === PermissionAction.Create) {
                customLabel = $localize`Execute Feed`;
            }
        }

        if (this.subject === PermissionSubject.Billing) {
            if (this.action === PermissionAction.Delete) {
                customLabel = $localize`Resiliate Subscription`;
            }
        }

        // Default translation "Action Subject"
        if (!customLabel) {
            let actionI18N;

            switch (this.action) {
                case PermissionAction.Create:
                    actionI18N = $localize`Create`;
                    break;
                case PermissionAction.Read:
                    actionI18N = $localize`Read`;
                    break;
                case PermissionAction.Update:
                    actionI18N = $localize`Update`;
                    break;
                case PermissionAction.Delete:
                    actionI18N = $localize`Delete`;
                    break;
                case PermissionAction.Manage:
                    actionI18N = $localize`Manage`;
                    break;
                default:
                    actionI18N = $localize`N/A`;
                    break;
            }

            let subjectI18N;
            switch (this.subject) {
                case PermissionSubject.Organization:
                    subjectI18N = $localize`Organization`;
                    break;
                case PermissionSubject.UserRole:
                    subjectI18N = $localize`User Role`;
                    break;
                case PermissionSubject.User:
                    subjectI18N = $localize`User`;
                    break;
                case PermissionSubject.Feed:
                    subjectI18N = $localize`Feed`;
                    break;
                case PermissionSubject.FeedRun:
                    subjectI18N = $localize`Feed Run`;
                    break;
                case PermissionSubject.Article:
                    subjectI18N = $localize`Article`;
                    break;
                case PermissionSubject.Billing:
                    subjectI18N = $localize`Billing`;
                    break;
                default:
                    subjectI18N = $localize`N/A`;
                    break;
            }

            this.label = `${actionI18N} ${subjectI18N}`;
        } else {
            this.label = customLabel;
        }
    }
}

interface RolePermissions {
    name: Role;
    permissions: Permission[];
}

@Injectable({
    providedIn: 'root',
})
export class PermissionService {
    private readonly domain: string;

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async getPermissions(): Promise<Permission[]> {
        return firstValueFrom(
            this.http.get<Permission[]>(`${this.domain}/permissions`),
        ).then((permissions) => {
            return permissions.map(
                (permission) =>
                    new Permission(permission.subject, permission.action),
            );
        });
    }

    // In the future, we may get the permissions for a specific organization
    // Allowing overrides
    async getRoles(): Promise<Record<Role, Permission[]>> {
        return firstValueFrom(
            this.http.get<RolePermissions[]>(`${this.domain}/roles`),
        ).then((roles: RolePermissions[]) => {
            return roles.reduce(
                (
                    acc: Record<Role, Permission[]>,
                    currentRole: RolePermissions,
                ) => {
                    acc[currentRole.name] = currentRole.permissions.map(
                        (permission) =>
                            new Permission(
                                permission.subject,
                                permission.action,
                            ),
                    );
                    return acc;
                },
                {} as Record<Role, Permission[]>,
            );
        });
    }
}
