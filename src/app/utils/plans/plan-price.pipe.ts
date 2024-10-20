import { Pipe, PipeTransform } from '@angular/core';
import { PlanType } from '../../services/organization.service';

@Pipe({
    name: 'planPrice',
    standalone: true,
})
export class PlanPricePipe implements PipeTransform {
    transform(plan: PlanType): number | string {
        switch (plan) {
            case PlanType.BASIC:
                return 200;
            case PlanType.EXTENDED:
                return 500;
            case PlanType.ENTERPRISE:
                return $localize`Custom pricing`;
            case PlanType.FREE:
                return 0;
            default:
                console.warn('Unknown plan', plan);
                return 0;
        }
    }
}
