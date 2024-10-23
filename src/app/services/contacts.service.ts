import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { AuthorizationType, DialogConfig, Feed } from './feed.service';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { HttpClient } from '@angular/common/http';

export enum ContactsProviderType {
    Brevo = 'brevo',
    Sendgrid = 'sendgrid',
    ElasticEmail = 'elasticemail',
}

export interface ContactsProvider {
    _id: string;

    organization: string;

    displayName: string;
    description: string;

    type: ContactsProviderType;

    isFavorite: boolean;

    authorizationType?: AuthorizationType;
    authorizationUsername?: string;
    authorizationToken?: string;
}

export interface CreateProviderDto
    extends Pick<
        ContactsProvider,
        | 'displayName'
        | 'description'
        | 'type'> {}

@Injectable()
export class ContactsService {
    private readonly domain: string;

    private selectedProvider$$: Subject<ContactsProvider> = new Subject<ContactsProvider>();
    selectedProvider$: Observable<ContactsProvider> = this.selectedProvider$$.asObservable();


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

    async getContactsProvider(organizationId: string, providerId: string): Promise<ContactsProvider> {
        return new Promise((resolve, reject) => {
                return resolve(
                    {
                        _id: providerId,
                        organization: organizationId,
                        displayName: 'Provider 1',
                        description: 'Provider 1 description',
                        type: ContactsProviderType.Brevo,
                        isFavorite: true,
                    }
                )
            }
        );

        // return firstValueFrom(
        //    this.http.get<ContactsProvider>(
        //        `${this.domain}/organizations/${organizationId}/providers/contacts/${providerId}`,
        //    ),
        //);
    }

    async getContactsProviders(organizationId: string): Promise<ContactsProvider[]> {
        return new Promise((resolve, reject) => {
            return resolve([
                {
                    _id: '1',
                    organization: organizationId,
                    displayName: 'Provider 1',
                    description: 'Provider 1 description',
                    type: ContactsProviderType.Brevo,
                    isFavorite: true,
                },
                {
                    _id: '2',
                    organization: organizationId,
                    displayName: 'Provider 2',
                    description: 'Provider 2 description',
                    type: ContactsProviderType.Sendgrid,
                    isFavorite: false,
                },
                {
                    _id: '3',
                    organization: organizationId,
                    displayName: 'Provider 3',
                    description: 'Provider 3 description',
                    type: ContactsProviderType.ElasticEmail,
                    isFavorite: false,
                }
            ]);
        });

        /*
        return firstValueFrom(
            this.http.get<ContactsProvider[]>(
                `${this.domain}/organizations/${organizationId}/providers/contacts`,
            ),
        );*/
    }

    async createContactsProvider(organizationId: string, provider: CreateProviderDto): Promise<ContactsProvider> {
        return firstValueFrom(
            this.http.post<ContactsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/contacts`,
                provider,
            ),
        );
    }

    async updateContactsProvider(organizationId: string, provider: ContactsProvider): Promise<ContactsProvider> {
        return firstValueFrom(
            this.http.put<ContactsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/contacts/${provider._id}`,
                provider,
            ),
        );
    }

    async removeContactsProvider(organizationId: string, providerId: string): Promise<void> {
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
