import { AfterViewInit, Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit, AfterViewInit {
    rememberMe: boolean = false;

    email: string = '';
    password: string = '';

    isWaitingServer: boolean = false;

    showResetPasswordConfirmation: boolean = false;
    showInviteConfirmation: boolean = false;

    get lightMode(): boolean {
        return this.layoutService.isLightMode();
    }

    constructor(
        private layoutService: LayoutService,
        private authService: AuthService,
        private messageService: MessageService,
        private router: Router,
        private route: ActivatedRoute,
    ) {
        const navigation = this.router.getCurrentNavigation();
        if (navigation?.extras?.state?.['passwordReset'])
            this.showResetPasswordConfirmation = true;
        if (navigation?.extras?.state?.['inviteConfirmation'])
            this.showInviteConfirmation = true;
    }

    ngOnInit() {
        this.rememberMe = localStorage.getItem('autologin') === 'true';
    }

    ngAfterViewInit() {
        if (this.showResetPasswordConfirmation) {
            this.messageService.add({
                severity: 'info',
                summary: $localize`Password reset`,
                detail: $localize`You can now log in with your new password`,
            });
        }

        if (this.showInviteConfirmation) {
            this.messageService.add({
                severity: 'info',
                summary: $localize`Invite confirmed`,
                detail: $localize`You can now log in`,
            });
        }
    }

    async tryLogIn() {
        this.isWaitingServer = true;

        setTimeout(async () => {
            const success = await this.authService
                .logIn(this.email, this.password, this.rememberMe)
                .catch((err) => {
                    switch (err.status) {
                        case 401:
                            this.messageService.add({
                                severity: 'error',
                                summary: $localize`Login failed`,
                                detail: $localize`Invalid credentials`,
                            });
                            break;
                        case 403:
                            this.messageService.add({
                                severity: 'error',
                                summary: $localize`Login failed`,
                                detail: $localize`Invite pending confirmation`,
                            });
                            break;
                        default:
                            this.messageService.add({
                                severity: 'error',
                                summary: $localize`Login failed`,
                                detail: $localize`An error occurred`,
                            });
                            break;
                    }
                })
                .finally(() => (this.isWaitingServer = false));
            // TODO 2FA redirection if needed

            if (success) {
                const redirectTo =
                    this.route.snapshot.queryParams['redirectTo'] || '/';
                await this.router.navigateByUrl(redirectTo);
            }
        }, 200);
    }
}
