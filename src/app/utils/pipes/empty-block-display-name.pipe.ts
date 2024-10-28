import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emptyBlockDisplayName',
    standalone: true,
})
export class EmptyBlockDisplayNamePipe implements PipeTransform {
    transform(value: string): string {
        return value || $localize`New Block`;
    }
}
