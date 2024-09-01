import { FilterMetadata } from 'primeng/api';
import { FilterType, TagRule } from '../services/tag.service';

export class TableUtils {
    static matchModesOptionsForText = () => {
        return [
            { label: $localize`Starts with`, value: 'startsWith' },
            { label: $localize`Contains`, value: 'contains' },
            { label: $localize`Not contains`, value: 'notContains' },
            { label: $localize`Ends with`, value: 'endsWith' },
            { label: $localize`Equals`, value: 'equals' },
            { label: $localize`Not equals`, value: 'notEquals' },
        ];
    };

    static matchModesOptionsExact = () => {
        return [
            { label: $localize`Equals`, value: 'equals' },
            { label: $localize`Not equals`, value: 'notEquals' },
        ];
    };

    static matchModesOptionsForUrl = () => {
        return [
            { label: $localize`Starts with`, value: 'startsWith' },
            { label: $localize`Contains`, value: 'contains' },
            { label: $localize`Not contains`, value: 'notContains' },
            { label: $localize`Ends with`, value: 'endsWith' },
        ];
    };
}

export class TableFilterUtils {

    static filterTypesLocalized: Record<FilterType, string> = {
        'equals': $localize `=`,
        'notEquals': $localize `!=`,
        'contains': $localize `contains`,
        'notContains': $localize `not contains`,
        'startsWith': $localize `starts with`,
        'endsWith': $localize `ends with`,
        'gt': $localize `>`,
        'gte': $localize `>=`,
        'lt': $localize `<`,
        'lte': $localize `<=`,
        'in': $localize `in`,
        'nin': $localize `not in`,
        'dateIs': $localize `is`,
        'dateIsNot': $localize `is not`,
        'dateBefore': $localize `before`,
        'dateAfter': $localize `after`,
    };

    static convertFiltersToTagRules = (filters: { [p: string]: FilterMetadata[] }): TagRule[] => {
        const ruleset: TagRule[] = [];

        Object.keys(filters).forEach((field) => {
            const filter = filters[field];
            if (filter && filter.length) {
                if (filter[0].operator !== 'or' && filter[0].operator !== 'and') throw new Error('Invalid operator');
                ruleset.push({
                    field: field,
                    operator: filter[0].operator,
                    filters: filter.map((f) => {
                        return {
                            filterValue: f.value,
                            filterType: f.matchMode as FilterType,
                        };
                    })
                });
            }
        });

        return ruleset;
    }

    static hasFeed = (value: string[], filter: string[]): boolean => {
        if (filter === undefined || filter === null || !filter.length) {
            return true;
        }

        if (value === undefined || value === null) {
            return false;
        }

        return filter.every((f) => value.includes(f));
    };

    static dateIs = (value: any, filter: any): boolean => {
        if (!filter) {
            return true;
        }

        if (!value) {
            return false;
        }

        const filterDate = new Date(filter);
        const valueDate = new Date(value);

        return valueDate.toDateString() === filterDate.toDateString();
    };

    static dateIsNot = (value: any, filter: any): boolean => {
        if (!filter) {
            return true;
        }

        if (!value) {
            return true;
        }

        const filterDate = new Date(filter);
        const valueDate = new Date(value);

        return valueDate.toDateString() !== filterDate.toDateString();
    };

    static dateBefore = (value: any, filter: any): boolean => {
        if (!filter) {
            return true;
        }

        if (!value) {
            return false;
        }

        const filterDate = new Date(filter);
        const valueDate = new Date(value);

        return valueDate < filterDate;
    };

    static dateAfter = (value: any, filter: any): boolean => {
        if (!filter) {
            return true;
        }

        if (!value) {
            return false;
        }

        const filterDate = new Date(filter);
        const valueDate = new Date(value);

        return valueDate > filterDate;
    };
}
