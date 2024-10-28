import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthorizationType, DialogConfig, Feed } from './feed.service';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export enum ContactsProviderType {
    Internal = 'internal',

    Brevo = 'brevo',
    ElasticEmail = 'elasticemail',
    Sendgrid = 'sendgrid',
    Mailjet = 'mailjet',
    Mailchimp = 'mailchimp',
}

export interface ContactsProvider {
    id: string;

    organization: string;

    displayName: string;
    description: string;

    type: ContactsProviderType;

    isDefault: boolean;
    isVerified: boolean;

    externallyManaged: boolean;

    authorizationType?: AuthorizationType;
    authorizationUsername?: string;
    authorizationToken?: string;
}

export interface CreateProviderDto
    extends Pick<ContactsProvider, 'displayName' | 'description' | 'type'> {}

@Injectable()
export class ContactsService {
    private readonly domain: string;

    private selectedProvider$$: Subject<ContactsProvider> =
        new Subject<ContactsProvider>();
    selectedProvider$: Observable<ContactsProvider> =
        this.selectedProvider$$.asObservable();

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

    async getContactsProvider(
        organizationId: string,
        providerId: string,
    ): Promise<ContactsProvider> {
        return firstValueFrom(
            this.http.get<ContactsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/contacts/${providerId}`,
            ),
        );
    }

    async getContactsProviders(
        organizationId: string,
    ): Promise<ContactsProvider[]> {
        return firstValueFrom(
            this.http.get<ContactsProvider[]>(
                `${this.domain}/organizations/${organizationId}/providers/contacts`,
            ),
        );
    }

    async createContactsProvider(
        organizationId: string,
        provider: CreateProviderDto,
    ): Promise<ContactsProvider> {
        return firstValueFrom(
            this.http.post<ContactsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/contacts`,
                provider,
            ),
        );
    }

    async updateContactsProvider(
        organizationId: string,
        provider: ContactsProvider,
    ): Promise<ContactsProvider> {
        const updatableFields: Partial<ContactsProvider> = {
            displayName: provider.displayName,
            description: provider.description,
        };

        // TODO emit update to providers$$

        return firstValueFrom(
            this.http.patch<ContactsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/contacts/${provider.id}`,
                updatableFields,
            ),
        );
    }

    async removeContactsProvider(
        organizationId: string,
        providerId: string,
    ): Promise<void> {
        return firstValueFrom(
            this.http.delete<void>(
                `${this.domain}/organizations/${organizationId}/providers/contacts/${providerId}`,
            ),
        );
    }

    // UI

    selectContactsProvider(provider: ContactsProvider) {
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
