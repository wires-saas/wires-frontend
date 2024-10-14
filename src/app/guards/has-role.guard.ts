import { Injectable } from '@angular/core';
import {
    ActivatedRouteSnapshot,
    CanActivate,
    Router,
    RouterStateSnapshot,
    UrlTree,
} from '@angular/router';
import { AuthService } from '../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { RoleName, RoleUtils } from '../utils/role.utils';

// TODO remove hasRole guard and replace it with permission

@Injectable()
export class HasRoleGuard implements CanActivate {
    constructor(
        private authService: AuthService,
        private router: Router,
    ) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot,
    ): Promise<boolean | UrlTree> {
        const requiredRole = route.data['requiredRole'] as RoleName;

        const user = await firstValueFrom(this.authService.currentUser$);

        const slug = route.params['slug'];

        if (user) {
            if (slug) {
                const matchingRole = RoleUtils.hasRole(
                    user,
                    requiredRole,
                    slug,
                );

                if (matchingRole) return true;
                else {
                    console.error('Failed to match role', requiredRole);
                    return this.router.parseUrl('/auth/unauthorized');
                }
            } else {
                const matchingRole = RoleUtils.hasRole(user, requiredRole);

                if (matchingRole) return true;
                else {
                    console.error('Failed to match role', requiredRole);
                    return this.router.parseUrl('/auth/unauthorized');
                }
            }
        }

        return this.router.parseUrl('/auth/login?redirectTo=' + state.url);
    }
}
