import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MessageService } from 'primeng/api';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    rememberMe: boolean = false;

    email: string = '';
    password: string = '';

    isWaitingServer: boolean = false;

    constructor(private layoutService: LayoutService,
                private authService: AuthService,
                private messageService: MessageService,
                private router: Router,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.rememberMe = localStorage.getItem('autologin') === 'true';
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async tryLogIn() {
        this.isWaitingServer = true;

        setTimeout(async () => {

            const success = await this.authService.logIn(this.email, this.password, this.rememberMe).catch((err) => {

                switch (err.status) {
                    case 401:
                        this.messageService.add({severity: 'error', summary: 'Login failed', detail: 'Invalid credentials'});
                        break;
                    case 403:
                        this.messageService.add({severity: 'error', summary: 'Login failed', detail: 'Invite pending confirmation'});
                        break;
                    default:
                        this.messageService.add({severity: 'error', summary: 'Login failed', detail: 'An error occurred'});
                        break;
                }

            }).finally(() => this.isWaitingServer = false);
            // TODO 2FA redirection if needed

            if (success) {
                const redirectTo = this.route.snapshot.queryParams['redirectTo'] || '/';
                await this.router.navigateByUrl(redirectTo);
            }

        }, 200);
    }
}
