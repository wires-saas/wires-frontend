import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, RouterStateSnapshot, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';


@Injectable()
export class CanActivateAdministration implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(
        route: ActivatedRouteSnapshot,
        state: RouterStateSnapshot
    ): Promise<boolean | UrlTree> {
        return firstValueFrom(this.authService.currentUser$).then((user) => {
            console.log('canActivate', user?.isSuperAdmin);
            return !!user?.isSuperAdmin;
        });
    }
}
