import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { AuthService } from './auth.service';

export interface Notification {
    _id: string;
    action: string;
    scope: string;
    data?: Record<string, string>;
    createdAt: number;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {

    private readonly domain: string;

    constructor(
        private http: HttpClient,
        private authService: AuthService
    ) {
        this.domain = environment.backend;
    }

    async getNotifications(): Promise<Notification[]> {
        const user = await firstValueFrom(this.authService.currentUser$);
        if (!user) return [];
        else return firstValueFrom(this.http.get<Notification[]>(`${this.domain}/users/${user._id}/notifications`));
    }

}
