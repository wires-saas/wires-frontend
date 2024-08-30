import { DestroyRef, inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { User } from './user.service';
import { Role, RoleUtils } from '../utils/role.utils';
import { map } from 'rxjs/operators';
import { NotificationService } from './notification.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface ProfileData {
    jwt: {
        email: string;
        exp: number;
        iat: number;
        sub: string;
    };
    user: User;
}

@Injectable({
    providedIn: 'root',
})
export class AuthService {
    private readonly domain: string;

    private readonly currentUser$$: Subject<User | undefined> =
        new BehaviorSubject<User | undefined>(undefined);
    public readonly currentUser$ = this.currentUser$$.asObservable();

    private destroyRef = inject(DestroyRef);

    constructor(
        private http: HttpClient,
        private notificationService: NotificationService,
    ) {
        this.domain = environment.backend;

        this.currentUser$
            .pipe(
                map(async (user) => {
                    await this.notificationService.getNotifications(user?._id);
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    async logIn(
        email: string,
        password: string,
        rememberMe: boolean,
    ): Promise<boolean> {
        return firstValueFrom(
            this.http.post<{ access_token: string; user: User }>(
                `${this.domain}/auth/login`,
                {
                    email,
                    password,
                },
            ),
        ).then((response) => {
            localStorage.setItem('access_token', response.access_token);

            if (rememberMe) {
                localStorage.setItem('autologin', 'true');
            } else {
                localStorage.removeItem('autologin');
            }

            response.user.roles = response.user.roles.map((userRole) => ({
                ...userRole,
                permissions: RoleUtils.convertManagePermissions(
                    userRole.permissions,
                ),
            }));

            this.currentUser$$.next(response.user);
            return true;
        });
    }

    async logOut(): Promise<void> {
        localStorage.removeItem('access_token');
        this.currentUser$$.next(undefined);

        return firstValueFrom(
            this.http.post<void>(`${this.domain}/auth/logout`, {}),
        );
    }

    async getProfile(): Promise<ProfileData> {
        return firstValueFrom(
            this.http.get<ProfileData>(`${this.domain}/auth/profile`),
        ).then((profile) => {
            if (profile.user) {
                profile.user.roles = profile.user.roles.map((userRole) => ({
                    ...userRole,
                    permissions: RoleUtils.convertManagePermissions(
                        userRole.permissions,
                    ),
                }));
                this.currentUser$$.next(profile.user);
            }
            return profile;
        });
    }

    async checkInviteToken(
        token: string,
    ): Promise<{ organization: string; firstName: string }> {
        return firstValueFrom(
            this.http.get<{ organization: string; firstName: string }>(
                `${this.domain}/auth/invite/${token}`,
            ),
        );
    }

    async useInviteToken(token: string, password: string): Promise<void> {
        return firstValueFrom(
            this.http.post<void>(`${this.domain}/auth/invite/${token}`, {
                password,
            }),
        );
    }

    async requestPasswordReset(email: string): Promise<void> {
        return firstValueFrom(
            this.http.post<void>(`${this.domain}/auth/password`, { email }),
        );
    }

    async checkPasswordResetToken(
        token: string,
    ): Promise<{ organization: string; firstName: string }> {
        return firstValueFrom(
            this.http.get<{ organization: string; firstName: string }>(
                `${this.domain}/auth/password/${token}`,
            ),
        );
    }

    async usePasswordResetToken(
        token: string,
        password: string,
    ): Promise<void> {
        return firstValueFrom(
            this.http.post<void>(`${this.domain}/auth/password/${token}`, {
                password,
            }),
        );
    }

    hasRole$(role: Role, slug?: string): Observable<boolean> {
        return this.currentUser$.pipe(
            map((user) => {
                if (!user) return false;

                return RoleUtils.hasRole(user, role, slug);
            }),
        );
    }

    hasPermission$(permission: string, slug?: string): Observable<boolean> {
        return this.currentUser$.pipe(
            map((user) => {
                if (!user) return false;

                return RoleUtils.hasPermission(user, permission, slug);
            }),
        );
    }

    hasAtLeast$(permissions: string[], slug?: string): Observable<boolean> {
        return this.currentUser$.pipe(
            map((user) => {
                if (!user) return false;

                return !!permissions.find((permission) =>
                    RoleUtils.hasPermission(user, permission, slug),
                );
            }),
        );
    }

    hasAll$(permissions: string[], slug?: string): Observable<boolean> {
        return this.currentUser$.pipe(
            map((user) => {
                if (!user) return false;

                return permissions.every((permission) =>
                    RoleUtils.hasPermission(user, permission, slug),
                );
            }),
        );
    }
}
