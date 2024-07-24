import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { User } from './user.service';

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

    private readonly currentUser$$: Subject<User | undefined> = new BehaviorSubject<User | undefined>(undefined);
    public readonly currentUser$ = this.currentUser$$.asObservable();

    constructor(
        private http: HttpClient
    ) {
        this.domain = environment.backend;
    }

    async logIn(email: string, password: string, rememberMe: boolean): Promise<boolean> {
        return firstValueFrom(this.http.post<{ access_token: string; user: User; }>(`${this.domain}/auth/login`, {
            email,
            password
        })).then((response) => {
            localStorage.setItem('access_token', response.access_token);

            if (rememberMe) {
                localStorage.setItem('autologin', 'true');
            } else {
                localStorage.removeItem('autologin');
            }

            this.currentUser$$.next(response.user);
            return true;
        });
    }

    async logOut(): Promise<void> {
        localStorage.removeItem('access_token');
        this.currentUser$$.next(undefined);

        return firstValueFrom(this.http.post<void>(`${this.domain}/auth/logout`, {}));
    }

    async getProfile(): Promise<ProfileData> {
        return firstValueFrom(this.http.get<ProfileData>(`${this.domain}/auth/profile`))
            .then((profile) => {
                if (profile.user) this.currentUser$$.next(profile.user);
                return profile;
            });
    }


}
