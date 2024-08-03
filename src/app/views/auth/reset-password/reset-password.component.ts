import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';

@Component({
    templateUrl: './reset-password.component.html',
})
export class ResetPasswordComponent implements OnInit {


    welcomeNewUser: boolean = false;

    token: string = '';

    firstName: string = '';
    organizationName: string = '';

    password: string = '';
    passwordConfirmation: string = '';

    constructor(private layoutService: LayoutService, private router: Router,
                private activatedRoute: ActivatedRoute, private authService: AuthService) {}

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async ngOnInit() {

        this.welcomeNewUser = !!this.activatedRoute.snapshot.data['welcomeNewUser'];

        this.token = this.activatedRoute.snapshot.queryParams['token'];

        if (this.welcomeNewUser) {

            this.authService.checkInviteToken(this.token).then((data) => {
                this.firstName = data.firstName;
                this.organizationName = data.organization;
            });

        } else {

            this.authService.checkPasswordResetToken(this.token).then((data) => {
                this.firstName = data.firstName;
            });

        }

    }

    async submitPassword() {
        if (this.token && this.password && this.passwordConfirmation === this.password) {

            // TODO find a way to show message to user post password reset or invite acceptance

            if (this.welcomeNewUser) await this.authService.useInviteToken(this.token, this.password);
            else await this.authService.usePasswordResetToken(this.token, this.password);
            await this.router.navigate(['/auth/login']);
        }
    }
}
