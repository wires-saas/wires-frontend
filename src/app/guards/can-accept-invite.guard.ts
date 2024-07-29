import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth.service';


@Injectable()
export class CanAcceptInviteGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {

        const token = route.queryParams['token'];

        if (!token) {
            return false;
        }

        const tokenCode = await this.authService.checkToken(token).then(() => 200).catch((err) => {
            console.error(err);
            return err.status;
        });

        switch (tokenCode) {
            case 200:
                break;
            case 401:
                return this.router.parseUrl('/auth/expired-token');
            case 404:
                return this.router.parseUrl('/auth/invalid-token');
            default:
                return this.router.parseUrl('/auth/login');
        }

        return true;

    }
}
