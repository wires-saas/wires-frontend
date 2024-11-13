import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';

@Injectable()
export class CanAcceptOrganizationCreationInviteGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
    ): Promise<boolean | UrlTree> {
        const token = route.queryParams['token'];

        if (!token) {
            return false;
        }

        const tokenCode = await this.authService
            .checkOrganizationCreationInviteToken(token)
            .then(() => 200)
            .catch((err) => {
                console.error(err);
                return err.status;
            });

        switch (tokenCode) {
            case 200:
                break;
            case 410:
                return this.router.parseUrl(
                    '/auth/create-organization/already-used-token',
                );
            case 404:
                return this.router.parseUrl(
                    '/auth/create-organization/invalid-token',
                );
            default:
                return this.router.parseUrl('/auth/login');
        }

        return true;
    }
}
