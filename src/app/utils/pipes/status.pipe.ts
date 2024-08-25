import { Pipe, PipeTransform } from '@angular/core';
import { UserStatus } from '../../services/user.service';

@Pipe({
    name: 'status',
    standalone: true
})
export class StatusPipe implements PipeTransform {
    transform(status: UserStatus, ...args: unknown[]): string {
        switch (status) {
            case UserStatus.ACTIVE:
                return $localize `Active`;
            case UserStatus.INACTIVE:
                return $localize `Inactive`;
            case UserStatus.PENDING:
                return $localize `Pending`;
            default:
                return $localize `N/A`;
        }
    }
}
