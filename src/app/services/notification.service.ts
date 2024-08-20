import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';

export interface Notification {
    _id: string;
    action: string;
    scope: string;
    read: boolean;
    data?: Record<string, string>;
    createdAt: number;
}

@Injectable({
    providedIn: 'root',
})
export class NotificationService {

    private readonly domain: string;

    private currentUserNotifications$$: BehaviorSubject<Notification[]> = new BehaviorSubject<Notification[]>([]);
    public currentUserNotifications$: Observable<Notification[]> = this.currentUserNotifications$$.asObservable();

    constructor(
        private http: HttpClient
    ) {
        this.domain = environment.backend;
    }

    async getNotifications(userId?: string): Promise<Notification[]> {
        if (!userId) {
            this.currentUserNotifications$$.next([]);
            return [];
        } else {
            return firstValueFrom(this.http.get<Notification[]>(`${this.domain}/users/${userId}/notifications`))
                .then((notifications) => {
                    this.currentUserNotifications$$.next(notifications);
                    return notifications;
                });
        }
    }

    async readNotification(userId: string, notificationId: string): Promise<Notification> {
        return firstValueFrom(this.http.patch<Notification>(`${this.domain}/users/${userId}/notifications/${notificationId}`, { read: true }))
            .then((notification) => {
                const notificationsWithUpdate = this.currentUserNotifications$$.getValue().map((notif) => {
                    if (notif._id === notificationId) return notification;
                    else return notif;
                });

                this.currentUserNotifications$$.next(notificationsWithUpdate);
                return notification;
            });
    }

}
