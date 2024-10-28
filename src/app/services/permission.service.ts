import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { RoleName } from '../utils/role.utils';

export enum PermissionAction {
    Create = 'create',
    Read = 'read',
    Update = 'update',
    Delete = 'delete',
    Manage = 'manage',
}

export enum PermissionSubject {
    Organization = 'organization',
    Role = 'role',
    UserRole = 'userRole',
    User = 'user',
    Feed = 'feed',
    FeedRun = 'feedRun',
    Article = 'article',
    Billing = 'billing',
    Tag = 'tag',
    Gpt = 'gpt',
    GptRequest = 'gptRequest',
    Block = 'block',
    Folder = 'folder',
    ContactsProvider = 'contactsProvider',
    EmailsProvider = 'emailsProvider',
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

        if (this.subject === PermissionSubject.Gpt) {
            if (this.action === PermissionAction.Update) {
                customLabel = $localize`Modify AI`;
            } else if (this.action === PermissionAction.Delete) {
                customLabel = $localize`Disable AI`;
            } else if (this.action === PermissionAction.Read) {
                customLabel = $localize`Read AI`;
            }
        }

        if (this.subject === PermissionSubject.GptRequest) {
            if (this.action === PermissionAction.Create) {
                customLabel = $localize`Send AI Request`;
            } else if (this.action === PermissionAction.Read) {
                customLabel = $localize`View AI Requests`;
            } else if (this.action === PermissionAction.Manage) {
                customLabel = $localize`Manage AI Requests`;
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
                case PermissionSubject.Role:
                    subjectI18N = $localize`Role`;
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
                case PermissionSubject.Tag:
                    subjectI18N = $localize`Tag`;
                    break;
                case PermissionSubject.Gpt:
                    subjectI18N = $localize`GPT`;
                    break;
                case PermissionSubject.GptRequest:
                    subjectI18N = $localize`GPT Request`;
                    break;
                case PermissionSubject.Block:
                    subjectI18N = $localize`Block`;
                    break;
                case PermissionSubject.Folder:
                    subjectI18N = $localize`Folder`;
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

export interface RolePermissions {
    previousName?: RoleName | string;
    name: RoleName | string;
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

    async getRoles(
        organizationId: string,
    ): Promise<Record<RoleName | string, Permission[]>> {
        return firstValueFrom(
            this.http.get<RolePermissions[]>(
                `${this.domain}/organizations/${organizationId}/roles`,
            ),
        ).then((roles: RolePermissions[]) => {
            return roles.reduce(
                (
                    acc: Record<RoleName | string, Permission[]>,
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
                {} as Record<RoleName, Permission[]>,
            );
        });
    }

    async updateRoles(
        organizationId: string,
        roles: RolePermissions[],
    ): Promise<void> {
        return firstValueFrom(
            this.http.put<void>(
                `${this.domain}/organizations/${organizationId}/roles`,
                roles,
            ),
        );
    }
}
