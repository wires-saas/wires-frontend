import { Pipe, PipeTransform } from '@angular/core';
import {PlanStatus} from '../../services/organization.service';

@Pipe({
    name: 'planStatus',
    standalone: true,
})
export class PlanStatusPipe implements PipeTransform {
    transform(status: PlanStatus): string {
        switch (status) {
            case PlanStatus.ACTIVE:
                return $localize`Active`;
            case PlanStatus.CANCELLED:
                return $localize`Cancelled`;
            case PlanStatus.EXPIRED:
                return $localize`Expired`;
            case PlanStatus.INCOMPLETE:
                return $localize`Incomplete`;
            default:
                return $localize`N/A`;
        }
    }
}
