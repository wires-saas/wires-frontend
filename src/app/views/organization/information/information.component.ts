import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { CountriesUtils } from '../../../utils/countries.utils';
import {
    Organization,
    OrganizationContact,
    OrganizationService,
} from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { deepEquals } from '../../../utils/deep-equals';
import { MessageUtils } from '../../../utils/message.utils';
import { MessageService } from 'primeng/api';
import { UpdateOrganization } from '../../../utils/permission.utils';

interface OrganizationIdentity {
    name: string;
    legalName: string;
    website: string;
    activity: string;
    logo: string;
    legalId: string;

    address: {
        street: string;
        city: string;
        zip: string;
        country: any;
    };
}

@Component({
    templateUrl: './information.component.html',
})
export class InformationComponent implements OnInit {
    countries: any[] = [];

    identityForm: FormGroup = new FormGroup({
        name: new FormControl(''),
        legalName: new FormControl(''),
        website: new FormControl(''),
        activity: new FormControl(''),
        logo: new FormControl(''),
        legalId: new FormControl(''),

        address: new FormGroup({
            street: new FormControl(''),
            city: new FormControl(''),
            zip: new FormControl(''),
            country: new FormControl(),
        }),
    });

    adminContactForm: FormGroup = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl('', Validators.email),
        phone: new FormControl(''),
        consent: new FormControl(false),
    });

    billingContactForm: FormGroup = new FormGroup({
        firstName: new FormControl(''),
        lastName: new FormControl(''),
        email: new FormControl('', Validators.email),
        phone: new FormControl(''),
        consent: new FormControl(false),
    });

    identitySavedState: OrganizationIdentity | undefined;
    adminContactSavedState: OrganizationContact | undefined;
    billingContactSavedState: OrganizationContact | undefined;

    currentOrgSlug: string | undefined;

    private destroyRef = inject(DestroyRef);

    constructor(
        private organizationService: OrganizationService,
        private messageService: MessageService,
    ) {}

    ngOnInit() {
        this.countries = CountriesUtils.countries;

        this.organizationService.currentOrganization$
            .pipe(
                map((organization: Organization | undefined) => {
                    this.currentOrgSlug = organization?.slug;
                    if (organization) {
                        // Populating form fields
                        Object.entries(organization).forEach(([key, value]) => {
                            if (key === 'address') {
                                this.identityForm.get('address')?.setValue({
                                    street: value.street,
                                    city: value.city,
                                    zip: value.zip,
                                    country:
                                        this.countries.find(
                                            (country) =>
                                                country.code === value.country,
                                        ) || null,
                                });
                            } else {
                                if (this.identityForm.get(key)) {
                                    this.identityForm.get(key)?.setValue(value);
                                }
                            }
                        });

                        Object.entries(organization.adminContact).forEach(
                            ([key, value]) => {
                                if (this.adminContactForm.get(key)) {
                                    this.adminContactForm
                                        .get(key)
                                        ?.setValue(value);
                                }
                            },
                        );

                        Object.entries(organization.billingContact).forEach(
                            ([key, value]) => {
                                if (this.billingContactForm.get(key)) {
                                    this.billingContactForm
                                        .get(key)
                                        ?.setValue(value);
                                }
                            },
                        );

                        this.identitySavedState = this.identityForm.value;
                        this.adminContactSavedState =
                            this.adminContactForm.value;
                        this.billingContactSavedState =
                            this.billingContactForm.value;
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    private mapIdentityFormToPartialOrganization(): Partial<Organization> {
        return {
            ...this.identityForm.value,
            address: {
                ...this.identityForm.value.address,
                country: this.identityForm.value.address.country?.code || '',
            },
        };
    }

    canSaveIdentity() {
        return (
            this.identityForm.valid &&
            this.identityForm.dirty &&
            !deepEquals(this.identityForm.value, this.identitySavedState)
        );
    }

    canSaveAdminContact() {
        return (
            this.adminContactForm.valid &&
            this.adminContactForm.dirty &&
            this.adminContactForm.get('consent')?.value === true &&
            !deepEquals(
                this.adminContactForm.value,
                this.adminContactSavedState,
            )
        );
    }

    canSaveBillingContact() {
        return (
            this.billingContactForm.valid &&
            this.billingContactForm.dirty &&
            this.billingContactForm.get('consent')?.value === true &&
            !deepEquals(
                this.billingContactForm.value,
                this.billingContactSavedState,
            )
        );
    }

    async updateIdentityFields() {
        if (!this.currentOrgSlug)
            throw new Error('cannot update organization without slug');
        await this.organizationService
            .update(this.currentOrgSlug, {
                ...this.mapIdentityFormToPartialOrganization(),
            })
            .then(() => {
                this.identitySavedState = this.identityForm.value;

                this.messageService.add({
                    severity: 'info',
                    detail: $localize`Organization identity information updated successfully`,
                    life: 3000,
                });
            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error saving identity information`,
                });
            });
    }

    async updateAdminContact() {
        if (!this.currentOrgSlug)
            throw new Error('cannot update organization without slug');
        await this.organizationService
            .update(this.currentOrgSlug, {
                adminContact: this.adminContactForm.value,
            })
            .then(() => {
                this.adminContactSavedState = this.adminContactForm.value;

                this.messageService.add({
                    severity: 'info',
                    detail: $localize`Admin contact updated successfully`,
                    life: 3000,
                });
            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error updating admin contact`,
                });
            });
    }

    async updateBillingContact() {
        if (!this.currentOrgSlug)
            throw new Error('cannot update organization without slug');
        await this.organizationService
            .update(this.currentOrgSlug, {
                billingContact: this.billingContactForm.value,
            })
            .then(() => {
                this.billingContactSavedState = this.billingContactForm.value;

                this.messageService.add({
                    severity: 'info',
                    detail: $localize`Billing contact updated successfully`,
                    life: 3000,
                });
            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error updating billing contact`,
                });
            });
    }

    static permissions = [UpdateOrganization];
}
