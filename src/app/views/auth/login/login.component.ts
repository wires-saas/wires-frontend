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
                this.messageService.add({severity: 'error', summary: 'Login failed', detail: 'Invalid credentials'});
            }).finally(() => this.isWaitingServer = false);
            // TODO 2FA redirection if needed

            if (success) {
                const redirectTo = this.route.snapshot.queryParams['redirectTo'] || '/';
                await this.router.navigateByUrl(redirectTo);
            }

        }, 200);
    }
}
