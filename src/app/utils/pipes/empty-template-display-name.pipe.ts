import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emptyTemplateDisplayName',
    standalone: true,
})
export class EmptyTemplateDisplayNamePipe implements PipeTransform {
    transform(value: string): string {
        return value || $localize`New Template`;
    }
}
