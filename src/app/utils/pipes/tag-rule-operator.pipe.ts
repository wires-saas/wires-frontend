import { Pipe, PipeTransform } from '@angular/core';
import { FilterType } from '../../services/tag.service';
import { TableFilterUtils } from '../table.utils';

@Pipe({
    name: 'tagRuleOperator',
    standalone: true,
})
export class TagRuleOperatorPipe implements PipeTransform {
    transform(operator: 'and' | 'or'): string {
        switch (operator) {
            case 'and':
                return $localize `and`;
            case 'or':
                return $localize `or`;
            default:
                return operator;
        }
    }
}
