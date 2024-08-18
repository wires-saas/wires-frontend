import { Pipe, PipeTransform } from '@angular/core';
import { Plan } from '../../services/organization.service';

@Pipe({
    name: 'planPrice',
    standalone: true
})
export class PlanPricePipe implements PipeTransform {
    transform(plan: Plan, ...args: unknown[]): number | string {
        switch (plan) {
            case 'basic':
                return 200;
            case 'extended':
                return 500;
            case 'custom':
                return $localize `Custom pricing`;
            case 'free':
                return 0;
            default:
                console.warn('Unknown plan', plan);
                return 0;
        }
    }
}
