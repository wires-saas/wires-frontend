import { Pipe, PipeTransform } from '@angular/core';
import { TagRule } from '../../services/tag.service';
import { TableFilterUtils } from '../table.utils';

@Pipe({
    name: 'tagRule',
    standalone: true,
})
export class TagRulePipe implements PipeTransform {
    transform(rule: TagRule): string {
        const { operator, field, filters } = rule;

        const operatorLocalized =
            operator === 'and' ? $localize`and` : $localize`or`;

        const ruleContent = filters.map((filter) => {
            const filterTypeLocalized =
                TableFilterUtils.filterTypesLocalized[filter.filterType];
            return `${rule.field} ${filterTypeLocalized} ${filter.filterValue}`;
        });

        return ruleContent.join(` ${operatorLocalized} `);
    }
}
