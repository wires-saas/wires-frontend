import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    templateUrl: './newpassword.component.html',
})
export class NewPasswordComponent implements OnInit {


    welcomeNewUser: boolean = false;

    token: string = '';

    firstName: string = '';
    organizationName: string = '';

    constructor(private layoutService: LayoutService, private router: Router,
                private activatedRoute: ActivatedRoute, private authService: AuthService) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async ngOnInit() {

        this.welcomeNewUser = !!this.activatedRoute.snapshot.data['welcomeNewUser'];

        this.token = this.activatedRoute.snapshot.queryParams['token'];

        this.authService.checkToken(this.token).then((data) => {;
            this.firstName = data.firstName;
            this.organizationName = data.organization
        });

    }
}
