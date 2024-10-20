import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'arraySort',
})
export class ArraySortPipe implements PipeTransform {
    transform(array: any[], args: { [key: string]: 'asc' | 'desc' }): any[] {

        if (!array || !args || !array.length) {
            return array;
        }

        const type = typeof array[0][Object.keys(args)[0]];

        return array.sort((a, b) => {
            return Object.keys(args)
                .map((key) => {

                    let result: number;

                    switch (type) {
                        case 'string':
                            result = a[key].localeCompare(b[key]);
                            break;
                        case 'number':
                            result = a[key] - b[key];
                            break;
                        default:
                            result = 0;
                            break;
                    }

                    return args[key] === 'asc' ? result : -result;

                })
                .reduce((p, n) => (p ? p : n), 0);
        });
    }
}
