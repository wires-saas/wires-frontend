import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './newpassword.component.html',
})
export class NewPasswordComponent implements OnInit {


    welcomeNewUser: boolean = false;

    token: string | undefined;

    constructor(private layoutService: LayoutService, private router: Router, private activatedRoute: ActivatedRoute) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    ngOnInit() {

        this.welcomeNewUser = !!this.activatedRoute.snapshot.data['welcomeNewUser'];

        this.token = this.activatedRoute.snapshot.queryParams['token'];
    }
}
