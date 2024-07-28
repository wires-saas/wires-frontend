import { Component, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../services/organization.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { UserService } from '../../../../services/user.service';

@Component({
    templateUrl: './create-user.component.html'
})
export class CreateUserComponent implements OnInit {

    countries: any[] = [];

    userCountry: any = {name: 'France', code: 'FR'};

    userForm: FormGroup = new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        country: new FormControl('', Validators.required),
    });

    get organizationName$(): Observable<string> {
        return this.organizationService.currentOrganization$.pipe(map(org => org?.name || ''));
    }

    constructor(private organizationService: OrganizationService, private userService: UserService) {
    }

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
    }

    async onSubmit() {
        console.log(this.userForm.value);

        await this.userService.createUser(this.userForm.value);
    }

}
