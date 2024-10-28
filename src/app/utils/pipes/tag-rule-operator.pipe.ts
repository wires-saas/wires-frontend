import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'tagRuleOperator',
    standalone: true,
})
export class TagRuleOperatorPipe implements PipeTransform {
    transform(operator: 'and' | 'or'): string {
        switch (operator) {
            case 'and':
                return $localize`and`;
            case 'or':
                return $localize`or`;
            default:
                return operator;
        }
    }
}
