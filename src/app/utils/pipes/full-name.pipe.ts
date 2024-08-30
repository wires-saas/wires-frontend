import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'fullName',
    standalone: true,
})
export class FullNamePipe implements PipeTransform {
    transform(
        person: { firstName: string; lastName: string } | undefined,
    ): string {
        return person ? person.firstName + ' ' + person.lastName : '';
    }
}
