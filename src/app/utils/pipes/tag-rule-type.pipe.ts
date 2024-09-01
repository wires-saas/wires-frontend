import { Pipe, PipeTransform } from '@angular/core';
import { FilterType } from '../../services/tag.service';
import { TableFilterUtils } from '../table.utils';

@Pipe({
    name: 'tagRuleType',
    standalone: true,
})
export class TagRuleTypePipe implements PipeTransform {
    transform(type: FilterType): string {
        return TableFilterUtils.filterTypesLocalized[type];
    }
}
