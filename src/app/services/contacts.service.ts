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

export enum ContactStatus {
    Active = 'active',
    Unsubscribed = 'unsubscribed',
    Bounced = 'bounced',
    Spam = 'spam',
}

export interface Contact {
    id: string;
    email: string;
    firstName?: string;
    lastName?: string;
    status: ContactStatus;
    createdAt: string;
    updatedAt: string;
    lists: string[];
    phone?: string;
    customData: Record<string, any>;
}

export interface ContactFieldDefinition {
    name: string;
    type: 'string' | 'number' | 'boolean' | 'date';
    required: boolean;
    description?: string;
}

export interface ContactsQueryOptions {
    page?: number;
    limit?: number;
    email?: string;
    status?: ContactStatus;
    list?: string;
    sortField?: string;
    sortOrder?: number;
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

    // PROVIDERS API

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

    // CONTACTS API (mocked)

    async createContact(
        organizationId: string,
        contact: Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>,
    ): Promise<Contact> {
        // Mocked contact with generated id and timestamps
        return Promise.resolve({
            id: 'mocked-contact-id',
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            ...contact,
            status: contact.status ?? ContactStatus.Active,
            lists: contact.lists ?? [],
            customData: {},
        });
    }

    async getContacts(
        organizationId: string,
        options?: ContactsQueryOptions,
    ): Promise<{ data: Contact[]; total: number }> {

        console.log('getContacts',options);

        if (organizationId === 'breizh') {
            return {
                data: [],
                total: 0,
            };
        }

        if (organizationId !== 'alphabet') {
            throw new Error('Not implemented');
        }

        // Mocked list of contacts
        const allContacts: Contact[] = [
            {
                id: 'mocked-contact-1',
                email: 'john.doe@example.com',
                firstName: 'John',
                lastName: 'Doe',
                status: ContactStatus.Active,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lists: ['list-1'],
                customData: {},
            },
            {
                id: 'mocked-contact-2',
                email: 'jane.smith@example.com',
                firstName: 'Jane',
                lastName: 'Smith',
                status: ContactStatus.Unsubscribed,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lists: ['list-2'],
                customData: {},
            },
            {
                id: 'mocked-contact-3',
                email: 'bob.brown@example.com',
                firstName: 'Bob',
                lastName: 'Brown',
                status: ContactStatus.Bounced,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString(),
                lists: ['list-1', 'list-2'],
                customData: {},
            },
        ];

        let filtered = allContacts;
        if (options) {
            if (options.email) {
                filtered = filtered.filter(c => c.email.includes(options.email!));
            }
            if (options.status) {
                filtered = filtered.filter(c => c.status === options.status);
            }
            if (options.list) {
                filtered = filtered.filter(c => c.lists.includes(options.list!));
            }
        }
        const total = filtered.length;
        const page = options?.page ?? 0;
        const limit = options?.limit ?? filtered.length;
        const data = filtered.slice(page * limit, (page + 1) * limit);
        return new Promise((res, _) => {
            setTimeout(() => {
                res({ data, total });
            }, 1000);
        });
    }

    async getContactById(
        organizationId: string,
        contactId: string,
    ): Promise<Contact> {
        // Return a mocked contact
        return Promise.resolve({
            id: contactId,
            email: 'mocked.user@example.com',
            firstName: 'Mocked',
            lastName: 'User',
            status: ContactStatus.Active,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lists: ['mocked-list'],
            customData: {},
        });
    }

    async getContactFields(
        organizationId: string
    ): Promise<ContactFieldDefinition[]> {
        return Promise.resolve([
            {
                name: 'email',
                type: 'string',
                required: true,
                description: 'The email address of the contact',
            },
            {
                name: 'firstName',
                type: 'string',
                required: false,
                description: 'The first name of the contact',
            },
            {
                name: 'lastName',
                type: 'string',
                required: false,
                description: 'The last name of the contact',
            },
        ]);
    }

    async updateContact(
        organizationId: string,
        contactId: string,
        update: Partial<Omit<Contact, 'id' | 'createdAt' | 'updatedAt'>>,
    ): Promise<Contact> {
        // Return a mocked updated contact
        return Promise.resolve({
            id: contactId,
            email: update.email || 'updated.user@example.com',
            firstName: update.firstName || 'Updated',
            lastName: update.lastName || 'User',
            status: update.status || ContactStatus.Active,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString(),
            lists: update.lists || ['updated-list'],
            customData: {},
        });
    }

    async deleteContact(
        organizationId: string,
        contactId: string,
    ): Promise<void> {
        // Mocked delete (no return value)
        return Promise.resolve();
    }
}
