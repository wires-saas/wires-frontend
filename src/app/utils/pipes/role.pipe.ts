import { Pipe, PipeTransform } from '@angular/core';
import { RoleName } from '../role.utils';

@Pipe({
    name: 'role',
    standalone: true,
})
export class RolePipe implements PipeTransform {
    transform(role: RoleName | string): string {
        switch (role) {
            case RoleName.SUPER_ADMIN:
                return $localize`Super Admin`;
            case RoleName.ADMIN:
                return $localize`Admin`;
            case RoleName.MANAGER:
                return $localize`Manager`;
            case RoleName.USER:
                return $localize`User`;
            case RoleName.GUEST:
                return $localize`Guest`;
            default:
                return role.charAt(0).toUpperCase() + role.slice(1);
        }
    }
}
