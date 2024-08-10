import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CountriesUtils } from '../../../utils/countries.utils';
import { Organization, OrganizationService } from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    templateUrl: './information.component.html'
})
export class InformationComponent implements OnInit {

    countries: any[] = [];

    adminContactConsents: boolean = false;
    billingContactConsents: boolean = false;

    force2FA: boolean = false;

    optionsFor2FA= [
        { name: 'Email', id: "email" },
        { name: 'SMS (not yet implemented)', id: "sms", disabled: true },
    ];

    selectedOptionsFor2FA: string[] = ["email"];

    name: string = '';
    legalName: string = '';
    website: string = '';
    activity: string = '';
    logo: string = '';
    companyId: string = '';

    street: string = '';
    city: string = '';
    zip: string = '';
    organizationCountry: any;

    currentOrgSlug: string | undefined;

    private destroyRef = inject(DestroyRef);

    constructor(private organizationService: OrganizationService) {
    }

    ngOnInit() {
        this.countries = CountriesUtils.countries;

        this.organizationService.currentOrganization$.pipe(
            map((organization: Organization | undefined) => {
                this.currentOrgSlug = organization?.slug;
                if (organization) {
                    this.name = organization.name;
                    this.legalName = organization.legalName;
                    this.website = organization.website;
                    this.activity = organization.activity;
                    this.logo = organization.logo;
                    this.companyId = organization.legalId;

                    this.street = organization.address?.street || '';
                    this.city = organization.address?.city || '';
                    this.zip = organization.address?.zip || '';
                    this.organizationCountry = this.countries.find((country) => country.code === organization.address?.country);
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

    }

    async updateIdentityFields() {
        // TODO loading spinner, error handling, success handling (info message)

        if (!this.currentOrgSlug) throw new Error('cannot update organization without slug');
        await this.organizationService.update(this.currentOrgSlug, {
            name: this.name,
            legalName: this.legalName,
            legalId: this.companyId,
            website: this.website,
            activity: this.activity,
            logo: this.logo,
            address: {
                street: this.street,
                city: this.city,
                zip: this.zip,
                country: this.organizationCountry.code,
            }
        });
    }

}
