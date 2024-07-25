import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class AutologinGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        const user = await firstValueFrom(this.authService.currentUser$);

        // We already have a user, so we bypass login screen
        if (user) {
            return this.router.parseUrl('/');
        } else {
            // No user but we can try to autologin if enabled
            const autologinEnabled = localStorage.getItem('autologin') === 'true';
            if (!autologinEnabled) return true;

            // If autologin enabled, trying to find a jwt token
            const token = localStorage.getItem('access_token');
            if (!token) return true;
            else {
                // If token found, trying to autologin
                return await this.authService.getProfile()
                    .then(() => {
                        const redirectTo = route.queryParams['redirectTo'] || '/';
                        return this.router.parseUrl(redirectTo);
                    })
                    .catch((err) => {
                        console.error('autologin failed', err);
                        localStorage.removeItem('access_token');
                        return true;
                    });
            }
        }
    }
}
