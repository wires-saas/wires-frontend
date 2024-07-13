import { Component, OnInit } from '@angular/core';

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
        this.countries = [
            {name: 'Australia', code: 'AU'},
            {name: 'Brazil', code: 'BR'},
            {name: 'China', code: 'CN'},
            {name: 'Egypt', code: 'EG'},
            {name: 'France', code: 'FR'},
            {name: 'Germany', code: 'DE'},
            {name: 'India', code: 'IN'},
            {name: 'Japan', code: 'JP'},
            {name: 'Spain', code: 'ES'},
            {name: 'United States', code: 'US'}
        ];

        //setTimeout(() => alert(this.selectedOptionsFor2FA), 5000);
    }

}
