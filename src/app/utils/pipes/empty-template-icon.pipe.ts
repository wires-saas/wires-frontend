import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emptyTemplateIcon',
    standalone: true,
})
export class EmptyTemplateIconPipe implements PipeTransform {
    transform(value: string): string {
        return value || 'fa-regular fa-block-question';
    }
}
