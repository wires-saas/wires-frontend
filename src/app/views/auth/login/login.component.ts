import { Component, OnInit } from '@angular/core';
import { LayoutService } from 'src/app/layout/service/app.layout.service';
import { AuthService } from '../../../services/auth.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
    templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
    rememberMe: boolean = false;

    email: string = '';
    password: string = '';

    constructor(private layoutService: LayoutService,
                private authService: AuthService,
                private router: Router,
                private route: ActivatedRoute) {}

    ngOnInit() {
        this.rememberMe = localStorage.getItem('autologin') === 'true';
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async tryLogIn() {
        const success = await this.authService.logIn(this.email, this.password, this.rememberMe);
        // TODO 2FA redirection if needed

        if (success) {
            const redirectTo = this.route.snapshot.queryParams['redirectTo'] || '/';
            await this.router.navigateByUrl(redirectTo);
        }
    }
}
