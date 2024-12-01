import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emptyTemplateDescription',
    standalone: true,
})
export class EmptyTemplateDescriptionPipe implements PipeTransform {
    transform(value: string): string {
        return value || $localize`Edit description here`;
    }
}
