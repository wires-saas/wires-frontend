import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../../services/auth.service';
import { PasswordUtils } from '../../../utils/password.utils';

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

    mediumRegex: string = PasswordUtils.MEDIUM_STRING;
    strongRegex: string = PasswordUtils.STRONG_STRING;


    get passwordLengthOK(): boolean {
        return this.password.length >= 12;
    }

    get passwordUppercaseOK(): boolean {
        return /[A-Z]/.test(this.password);
    }

    get passwordLowercaseOK(): boolean {
        return /[a-z]/.test(this.password);
    }

    get passwordDigitOK(): boolean {
        return /[0-9]/.test(this.password);
    }

    get passwordSpecialCharOK(): boolean {
        return /[^A-Za-z0-9]/.test(this.password);
    }

    get canSubmit(): boolean {
        return this.password === this.passwordConfirmation
            && this.passwordLengthOK
            && this.passwordUppercaseOK
            && this.passwordLowercaseOK
            && this.passwordDigitOK
            && this.passwordSpecialCharOK;
    }

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

            if (this.welcomeNewUser) {
                await this.authService.useInviteToken(this.token, this.password);
                await this.router.navigate(['/auth/login'], { state: { inviteConfirmation: true } });
            } else {
                await this.authService.usePasswordResetToken(this.token, this.password);
                await this.router.navigate(['/auth/login'], { state: { passwordReset: true } });
            }

        }
    }
}
