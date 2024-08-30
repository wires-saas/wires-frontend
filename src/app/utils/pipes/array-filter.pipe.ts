import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'arrayFilter',
})
export class ArrayFilterPipe implements PipeTransform {
    transform(array: any[], args: { [key: string]: any }): any[] {
        return array.filter((element) => {
            return Object.keys(args).every((key) => element[key] === args[key]);
        });
    }
}
