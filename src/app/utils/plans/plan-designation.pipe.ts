import { Pipe, PipeTransform } from '@angular/core';
import { PlanType } from '../../services/organization.service';

@Pipe({
    name: 'planDesignation',
    standalone: true,
})
export class PlanDesignationPipe implements PipeTransform {
    transform(plan: PlanType): string {
        switch (plan) {
            case PlanType.BASIC:
                return $localize`Basic Plan`;
            case PlanType.EXTENDED:
                return $localize`Extended Plan`;
            case PlanType.CUSTOM:
                return $localize`Enterprise Plan`;
            case PlanType.FREE:
                return $localize`Free Plan`;
            default:
                console.warn('Unknown plan', plan);
                return $localize`None`;
        }
    }
}
