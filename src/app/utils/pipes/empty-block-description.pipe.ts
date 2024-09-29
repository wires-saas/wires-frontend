import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'emptyBlockDescription',
    standalone: true,
})
export class EmptyBlockDescriptionPipe implements PipeTransform {
    transform(value: string): string {
        return value || $localize `Edit description here`;
    }
}
