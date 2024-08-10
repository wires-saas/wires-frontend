import { Component, OnInit } from '@angular/core';
import { CountriesUtils } from '../../../../utils/countries.utils';

@Component({
    templateUrl: './create-organization.component.html'
})
export class CreateOrganizationComponent implements OnInit {

    countries: any[] = [];

    ngOnInit() {
        this.countries = CountriesUtils.countries;
    }

}
