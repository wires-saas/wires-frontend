import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'duration',
    standalone: true,
    pure: true
})
export class DurationPipe implements PipeTransform {
    transform(duration: number, unit: 'ms' | 's' = 'ms'): string {
        if (unit === 's') duration *= 1000;

        if (duration < 1000) {
            return `${duration}ms`;
        } else if (duration < 60000) {
            return `${(duration / 1000).toFixed(0)}s`;
        } else if (duration < 3600000) {
            return `${(duration / 60000).toFixed(0)}m`;
        } else {
            return `${(duration / 3600000).toFixed(0)}h`;
        }
    }

}
