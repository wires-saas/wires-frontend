import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthorizationType, DialogConfig, Feed } from './feed.service';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export enum EmailsProviderType {
    Internal = 'internal',

    Brevo = 'brevo',
    ElasticEmail = 'elasticemail',
    Sendgrid = 'sendgrid',
    Mailjet = 'mailjet',
    Mailchimp = 'mailchimp',
}

export interface EmailsProvider {
    id: string;

    organization: string;

    displayName: string;
    description: string;

    type: EmailsProviderType;

    isDefault: boolean;
    isVerified: boolean;

    authorizationType?: AuthorizationType;
    authorizationUsername?: string;
    authorizationToken?: string;
}

export interface CreateEmailsProviderDto
    extends Pick<
        EmailsProvider,
        | 'displayName'
        | 'description'
        | 'type'> {}

@Injectable()
export class EmailsService {
    private readonly domain: string;

    private selectedProvider$$: Subject<EmailsProvider> = new Subject<EmailsProvider>();
    selectedProvider$: Observable<EmailsProvider> = this.selectedProvider$$.asObservable();

    dialogConfig: DialogConfig = {
        visible: false,
        header: '',
        isNew: false,
    };

    private dialogSource$$: BehaviorSubject<DialogConfig> =
        new BehaviorSubject<DialogConfig>(this.dialogConfig);
    dialogSource$: Observable<DialogConfig> = this.dialogSource$$.asObservable();

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async getEmailsProvider(organizationId: string, providerId: string): Promise<EmailsProvider> {
        return firstValueFrom(
            this.http.get<EmailsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${providerId}`,
            ),
        );
    }

    async getEmailsProviders(organizationId: string): Promise<EmailsProvider[]> {
        return firstValueFrom(
            this.http.get<EmailsProvider[]>(
                `${this.domain}/organizations/${organizationId}/providers/emails`,
            ),
        );
    }

    async createEmailsProvider(organizationId: string, provider: CreateEmailsProviderDto): Promise<EmailsProvider> {
        return firstValueFrom(
            this.http.post<EmailsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/emails`,
                provider,
            ),
        );
    }

    async updateEmailsProvider(organizationId: string, provider: EmailsProvider): Promise<EmailsProvider> {
        const updatableFields: Partial<EmailsProvider> = {
            displayName: provider.displayName,
            description: provider.description,
        };

        // TODO emit update to providers$$

        return firstValueFrom(
            this.http.patch<EmailsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${provider.id}`,
                updatableFields,
            ),
        );
    }

    async removeEmailsProvider(organizationId: string, providerId: string): Promise<void> {
        return firstValueFrom(
            this.http.delete<void>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${providerId}`,
            ),
        );
    }


    // UI

    selectEmailsProvider(provider: EmailsProvider) {
        this.selectedProvider$$.next(provider);
    }

    showDialog(header: string, newProvider: boolean) {
        this.dialogConfig = {
            visible: true,
            header: header,
            isNew: newProvider,
        };

        this.dialogSource$$.next(this.dialogConfig);
    }

    closeDialog() {
        this.dialogConfig = { visible: false };
        this.dialogSource$$.next(this.dialogConfig);
    }

}
