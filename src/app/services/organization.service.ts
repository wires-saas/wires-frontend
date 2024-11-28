import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {BehaviorSubject, firstValueFrom, Subject} from 'rxjs';
import { environment } from '../../environments/environment';
import { ActivatedRoute } from '@angular/router';
import { Slug } from '../utils/types.utils';

export enum PlanType {
    FREE = 'free',
    BASIC = 'basic',
    EXTENDED = 'extended',
    CUSTOM = 'custom',
}

export enum PlanStatus {
    INCOMPLETE = 'incomplete',
    ACTIVE = 'active',
    CANCELLED = 'cancelled',
    EXPIRED = 'expired',
}

export interface Plan {
    organization: Slug;
    type: PlanType;
    permissions: any[];
    customerEmail: string;
    currentPeriodStart: number;
    currentPeriodEnd: number;
    isTrial: boolean;
    status: PlanStatus;
    lastInvoice?: string;
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

    plan: Plan;

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

    gpt?: string;

    _nbMembers?: number;

    createdAt: number;
    updatedAt: number;
}

@Injectable({
    providedIn: 'root',
})
export class OrganizationService {
    private readonly domain: string;

    private currentOrganization$$: BehaviorSubject<Organization | undefined> =
        new BehaviorSubject<Organization | undefined>(undefined);
    public currentOrganization$ = this.currentOrganization$$.asObservable();

    private getAllPromise: Promise<Organization[]> | undefined;

    private organizationsChanged$$ = new Subject<void>();
    public organizationsChanged$ = this.organizationsChanged$$.asObservable();

    constructor(
        private http: HttpClient,
        private route: ActivatedRoute,
    ) {
        this.domain = environment.backend;
    }

    // Get all organizations
    async getAll(): Promise<Organization[]> {
        // avoiding double fetch
        if (this.getAllPromise) {
            return this.getAllPromise;
        }

        this.getAllPromise = firstValueFrom(
            this.http.get<any[]>(`${this.domain}/organizations`),
        ).then((organizations) => {
            return organizations;
        }).finally(() => {
            this.getAllPromise = undefined;
        });

        return this.getAllPromise;
    }

    async getPlan(organizationSlug: string): Promise<Plan> {
        return firstValueFrom(
            this.http.get<Plan>(
                `${this.domain}/organizations/${organizationSlug}/plan`,
            ),
        );
    }

    async create(organization: {
        name: string;
        slug: string;
        country?: string;
    }): Promise<Organization> {
        return firstValueFrom(
            this.http.post<Organization>(
                `${this.domain}/organizations`,
                organization,
            ),
        ).then((organizationCreated) => {
            this.organizationsChanged$$.next();
            return organizationCreated;
        });
    }

    // Update organization
    async update(
        organizationId: string,
        organization: Partial<Organization>,
    ): Promise<Organization> {
        return firstValueFrom(
            this.http.patch<Organization>(
                `${this.domain}/organizations/${organizationId}`,
                organization,
            ),
        ).then(async (organizationUpdated) => {
            // Update current in-memory organization if it's the same
            const currentOrganization = await firstValueFrom(
                this.currentOrganization$,
            );
            if (
                currentOrganization &&
                currentOrganization.slug === organizationUpdated.slug
            ) {
                this.currentOrganization$$.next(organizationUpdated);
            }

            return organizationUpdated;
        });
    }

    delete(organizationId: string): Promise<void> {
        return firstValueFrom(
            this.http.delete<void>(
                `${this.domain}/organizations/${organizationId}`,
            ),
        );
    }

    setCurrentOrganization(organization: Organization) {
        if (organization.slug !== this.currentOrganization$$?.value?.slug) {
            this.currentOrganization$$.next(organization);
        }
    }
}
