import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterState,
    RouterStateSnapshot,
    UrlTree
} from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()
export class AuthenticatedGuard implements CanActivate {
    constructor(private authService: AuthService, private router: Router) {}

    async canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Promise<boolean | UrlTree> {
        return firstValueFrom(this.authService.currentUser$).then((user) => {
            if (user) return true;
            else return this.router.parseUrl('/auth/login?redirectTo=' + state.url);
        });
    }
}
