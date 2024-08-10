import { Component, OnInit } from '@angular/core';
import { CountriesUtils } from '../../../utils/countries.utils';

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

    organizationCountry: any = {name: 'France', code: 'FR'};

    ngOnInit() {
        this.countries = CountriesUtils.countries;

        //setTimeout(() => alert(this.selectedOptionsFor2FA), 5000);
    }

}
