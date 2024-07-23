import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

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

export interface UserRole {
    organization: string;
    user: string;
    role: string;
}

export interface User {
    _id: string;
    firstName: string;
    lastName: string;
    email: string;
    password: string;
    status: UserStatus;
    emailStatus: UserEmailStatus;
    createdAt: number;
    updatedAt: number;
    lastSeenAt: number;

    roles: UserRole[];
}

@Injectable({
    providedIn: 'root',
})
export class UserService {

    private readonly domain: string;

    constructor(
        private http: HttpClient
    ) {
        this.domain = environment.backend;
    }

    async getUsers(): Promise<User[]> {
        return firstValueFrom(this.http.get<User[]>(`${this.domain}/users`));
    }


}
