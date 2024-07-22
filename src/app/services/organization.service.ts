import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';


export enum Plan {
    FREE = 'free',
    BASIC = 'basic',
    EXTENDED = 'extended',
    ENTERPRISE = 'custom',
}

export interface Organization {
    name: string;
    slug: string;
    logo: string;
    activity: string;

    address: {
        street: string;
        city: string;
        zip: string;
        country: string;
    };

    adminContact: {
        firstName: string;
        lastName: string;
        email: string;
    };

    billingContact: {
        firstName: string;
        lastName: string;
        email: string;
    };

    security: {
        twoFactorAuthenticationEnabled: boolean;
        twoFactorAuthenticationMethods: string[];
    };

    subscription: {
        type: Plan;
        willExpireAt: number;
    }

    createdAt: number;
    updatedAt: number;
}

@Injectable({
    providedIn: 'root',
})
export class OrganizationService {

    // Service on top of the organization CRUD API
    private domain: string = 'http://localhost:3000/v1';

    constructor(
        private http: HttpClient
    ) {
    }

    // Get all organizations
    getAll(): Promise<Organization[]> {
        // return firstValueFrom(this.http.get<any[]>(`${this.domain}/organizations`));
        return firstValueFrom(this.http.get<any[]>('assets/demo/data/organizations.json'));
    }


}
