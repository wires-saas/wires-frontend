import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, firstValueFrom, Subject } from 'rxjs';
import { environment } from '../../environments/environment';
import { User } from './user.service';
import { ActivatedRoute } from '@angular/router';


export enum Plan {
    FREE = 'free',
    BASIC = 'basic',
    EXTENDED = 'extended',
    ENTERPRISE = 'custom',
}

export interface OrganizationContact {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    consent: boolean;
}

export interface Organization {
    name: string;
    legalName: string;
    legalId: string;
    slug: string;
    website: string;
    logo: string;
    activity: string;

    address: {
        street: string;
        city: string;
        zip: string;
        country: string;
    };

    adminContact: OrganizationContact;

    billingContact: OrganizationContact;

    security: {
        twoFactorAuthenticationEnabled: boolean;
        twoFactorAuthenticationMethods: string[];
    };

    subscription: {
        type: Plan;
        willExpireAt?: number;
    }

    _nbMembers?: number;

    createdAt: number;
    updatedAt: number;
}

@Injectable({
    providedIn: 'root',
})
export class OrganizationService {

    private readonly domain: string;

    private currentOrganization$$: Subject<Organization | undefined> = new BehaviorSubject<Organization | undefined>(undefined);
    public currentOrganization$ = this.currentOrganization$$.asObservable();

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute
    ) {
        this.domain = environment.backend;
    }

    // Get all organizations
    getAll(): Promise<Organization[]> {
        return firstValueFrom(this.http.get<any[]>(`${this.domain}/organizations`));
        // return firstValueFrom(this.http.get<any[]>('assets/demo/data/organizations.json'));
    }

    create(organization: { name: string; slug: string; country?: string; }): Promise<Organization> {
        return firstValueFrom(this.http.post<Organization>(`${this.domain}/organizations`, organization));
    }

    // Update organization
    update(organizationId: string, organization: Partial<Organization>): Promise<Organization> {
        return firstValueFrom(this.http.patch<Organization>(`${this.domain}/organizations/${organizationId}`, organization));
    }

    delete(organizationId: string): Promise<void> {
        return firstValueFrom(this.http.delete<void>(`${this.domain}/organizations/${organizationId}`));
    }

    setCurrentOrganization(organization: Organization) {
        this.currentOrganization$$.next(organization);
    }


}
