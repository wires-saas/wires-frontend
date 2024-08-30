import { Injectable } from '@angular/core';
import { CanActivate, UrlTree } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { AuthService } from '../services/auth.service';

@Injectable()
export class IsSuperAdminGuard implements CanActivate {
    constructor(private authService: AuthService) {}

    async canActivate(): Promise<boolean | UrlTree> {
        return firstValueFrom(this.authService.currentUser$).then((user) => {
            return !!user?.isSuperAdmin;
        });
    }
}
