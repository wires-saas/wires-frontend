import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    standalone: true,
    name: 'arraySort'
})
export class ArraySortPipe implements PipeTransform {

    transform(array: any[], args: { [key: string]: 'asc' | 'desc' }): any[] {
        return array.sort((a, b) => {
            return Object
                .keys(args)
                .map((key) => {
                    if (args[key] === 'asc') {
                        return a[key] - b[key];
                    } else if (args[key] === 'desc') {
                        return b[key] - a[key];
                    } else {
                        return 0;
                    }
                })
                .reduce((p, n) => p ? p : n, 0);
        });
    }

}
