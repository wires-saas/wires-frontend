import { Component, OnInit } from '@angular/core';
import { CountriesUtils } from '../../../../utils/countries.utils';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { Organization, OrganizationService } from '../../../../services/organization.service';
import { Router } from '@angular/router';
import { MessageUtils } from '../../../../utils/message.utils';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './create-organization.component.html'
})
export class CreateOrganizationComponent implements OnInit {

    countries: any[] = [];

    creationForm: FormGroup = new FormGroup({
        name: new FormControl('', [Validators.required]),
        slug: new FormControl('', [Validators.required]),
        country: new FormControl('', [Validators.required]),
    });

    constructor(private organizationService: OrganizationService, private messageService: MessageService, private router: Router) {
    }

    ngOnInit() {
        this.countries = CountriesUtils.countries;
    }

    private mapCreationFormToDto(): { name: string; slug: string; country?: string; } {
        return {
            name: this.creationForm.value.name,
            slug: this.creationForm.value.slug,
            country: this.creationForm.value.country?.code,
        };
    }

    async createOrganization() {
        await this.organizationService.create(this.mapCreationFormToDto()).then((org) => {
            this.router.navigate(
                ['/administration/organizations/list'],
                { state: { created: this.creationForm.value.name } }
            );
        }).catch((err) => {
            console.error(err);

            MessageUtils.parseServerError(this.messageService, err, {
                summary: $localize `Error creating organization`,
            });
        });
    }

    canCreateOrganization() {
        return this.creationForm.valid;
    }

}
