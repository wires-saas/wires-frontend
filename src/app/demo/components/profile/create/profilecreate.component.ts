import { Component, OnInit } from '@angular/core';
import { CountriesUtils } from '../../../../utils/countries.utils';

@Component({
    templateUrl: './profilecreate.component.html',
})
export class ProfileCreateComponent implements OnInit {
    countries: any[] = [];

    ngOnInit() {
        this.countries = CountriesUtils.countries;
    }
}
