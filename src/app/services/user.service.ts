import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { RoleName, UserRole } from '../utils/role.utils';
import { Slug } from '../utils/types.utils';

export enum UserEmailStatus {
    CONFIRMED = 'confirmed',
    UNCONFIRMED = 'unconfirmed',
    CHANGE_REQUESTED = 'change_requested',
}

export enum UserStatus {
    ACTIVE = 'active',
    INACTIVE = 'inactive',
    PENDING = 'pending',
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    status: UserStatus;
    emailStatus: UserEmailStatus;
    inviteTokenExpiresAt: number;
    createdAt: number;
    updatedAt: number;
    lastSeenAt: number;

    street: string;
    city: string;
    zipCode: string;
    country: string;

    avatarUrl?: string;

    isSuperAdmin: boolean;
    roles: UserRole[];
}

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
}

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly domain: string;

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async getUsers(organizations?: Slug[]): Promise<User[]> {
        if (organizations?.length) {
            return firstValueFrom(
                this.http.get<User[]>(`${this.domain}/users`, {
                    params: {
                        organizations,
                    },
                }),
            );
        }

        return firstValueFrom(this.http.get<User[]>(`${this.domain}/users`));
    }

    async getUserById(id: string): Promise<User> {
        return firstValueFrom(
            this.http.get<User>(`${this.domain}/users/${id}`),
        );
    }

    async createUser(user: Partial<User>): Promise<User> {
        return firstValueFrom(
            this.http.post<User>(`${this.domain}/users`, user),
        );
    }

    async uploadAvatar(
        userId: string,
        file: File,
    ): Promise<{ fileName: string }> {
        const formData = new FormData();
        formData.append('avatar', file);

        return firstValueFrom(
            this.http.post<{ fileName: string }>(
                `${this.domain}/users/${userId}/avatar`,
                formData,
            ),
        );
    }

    async updateUser(userId: string, user: Partial<User>): Promise<User> {
        return firstValueFrom(
            this.http.patch<User>(`${this.domain}/users/${userId}`, user),
        );
    }

    async deleteUser(userId: string, orgSlug: Slug): Promise<void> {
        return firstValueFrom(
            this.http.delete<void>(`${this.domain}/users/${userId}`, {
                params: {
                    organization: orgSlug,
                },
            }),
        );
    }

    async resendInvite(userId: string): Promise<void> {
        return firstValueFrom(
            this.http.post<void>(`${this.domain}/users/${userId}/invite`, {}),
        );
    }

    async addUserRole(
        userId: string,
        orgSlug: Slug,
        role: RoleName,
    ): Promise<UserRole[]> {
        return firstValueFrom(
            this.http.post<UserRole[]>(`${this.domain}/users/${userId}/roles`, [
                { organization: orgSlug, role },
            ]),
        );
    }
}
