import { Pipe, PipeTransform } from '@angular/core';
import { Role } from '../role.utils';

@Pipe({
    name: 'role',
    standalone: true
})
export class RolePipe implements PipeTransform {
    transform(role: Role, ...args: unknown[]): string {
        switch (role) {
            case Role.SUPER_ADMIN:
                return $localize `Super Admin`;
            case Role.ADMIN:
                return $localize `Admin`;
            case Role.MANAGER:
                return $localize `Manager`;
            case Role.USER:
                return $localize `User`;
            case Role.GUEST:
                return $localize `Guest`;
            default:
                return $localize `N/A`;
        }
    }
}
