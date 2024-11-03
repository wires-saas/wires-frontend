import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DialogConfig } from './feed.service';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { EmailsProvider } from './emails.service';
import { HttpClient } from '@angular/common/http';


export enum SenderStatus {
    Available = 'available',
    Unavailable = 'unavailable',
}

export interface Sender {
    email: string;
    name: string;
    status?: SenderStatus;
}

@Injectable()
export class SenderService {
    private readonly domain: string;

    private selectedSender$$: Subject<Sender | undefined> =
        new BehaviorSubject<Sender | undefined>(undefined);
    selectedSender$: Observable<Sender | undefined> =
        this.selectedSender$$.asObservable();

    dialogConfig: DialogConfig = {
        visible: false,
        header: '',
        isNew: false,
    };

    private dialogSource$$: BehaviorSubject<DialogConfig> =
        new BehaviorSubject<DialogConfig>(this.dialogConfig);
    dialogSource$: Observable<DialogConfig> =
        this.dialogSource$$.asObservable();

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async createSender(
        organizationId: string,
        providerId: string,
        sender: Sender,
    ): Promise<EmailsProvider> {
        return firstValueFrom(
            this.http.post<EmailsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${providerId}/senders`,
                sender,
            ),
        );
    }

    async updateSenders(
        organizationId: string,
        providerId: string,
        senders: Sender[],
    ): Promise<EmailsProvider> {
        return firstValueFrom(
            this.http.put<EmailsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${providerId}/senders`,
                { senders },
            ),
        );
    }

    async removeSender(
        organizationId: string,
        providerId: string,
        sender: Sender,
    ): Promise<EmailsProvider> {
        return firstValueFrom(
            this.http.delete<EmailsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${providerId}/senders`,
                {
                    body: sender,
                },
            ),
        );
    }

    // UI

    selectSender(sender: Sender) {
        this.selectedSender$$.next(sender);
    }

    showDialog(header: string, newSender: boolean) {
        this.dialogConfig = {
            visible: true,
            header: header,
            isNew: newSender,
        };

        this.dialogSource$$.next(this.dialogConfig);
    }

    closeDialog() {
        this.dialogConfig = { visible: false };
        this.dialogSource$$.next(this.dialogConfig);
    }

}
