import { Pipe, PipeTransform } from '@angular/core';
import { Plan } from '../../services/organization.service';

@Pipe({
    name: 'planDesignation',
    standalone: true
})
export class PlanDesignationPipe implements PipeTransform {
    transform(plan: Plan, ...args: unknown[]): string {
        switch (plan) {
            case 'basic':
                return $localize `Basic Plan`;
            case 'extended':
                return $localize `Extended Plan`;
            case 'custom':
                return $localize `Enterprise Plan`;
            case 'free':
                return $localize `Free Plan`;
            default:
                console.warn('Unknown plan', plan);
                return $localize `None`;
        }
    }
}
