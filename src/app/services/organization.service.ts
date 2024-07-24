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

export interface Organization {
    name: string;
    slug: string;
    logo?: string;
    activity?: string;

    address?: {
        street: string;
        city: string;
        zip: string;
        country: string;
    };

    adminContact?: User;

    billingContact: User;

    security: {
        twoFactorAuthenticationEnabled: boolean;
        twoFactorAuthenticationMethods: string[];
    };

    subscription: {
        type: Plan;
        willExpireAt?: number;
    }

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
        console.log('constructed');
        this.domain = environment.backend;
        this.route.paramMap.subscribe(params => {
            console.log('params', params);
        });
    }

    // Get all organizations
    getAll(): Promise<Organization[]> {
        return firstValueFrom(this.http.get<any[]>(`${this.domain}/organizations`));
        // return firstValueFrom(this.http.get<any[]>('assets/demo/data/organizations.json'));
    }

    setCurrentOrganization(organization: Organization) {
        this.currentOrganization$$.next(organization);
    }


}
