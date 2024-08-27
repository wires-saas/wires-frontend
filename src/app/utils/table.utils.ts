export class TableUtils {
    static matchModesOptionsForText = () => {
        return [
            { label: $localize `Starts with`, value: 'startsWith' },
            { label: $localize `Contains`, value: 'contains' },
            { label: $localize `Not contains`, value: 'notContains' },
            { label: $localize `Ends with`, value: 'endsWith' },
            { label: $localize `Equals`, value: 'equals' },
            { label: $localize `Not equals`, value: 'notEquals' },
        ]
    }

    static matchModesOptionsForUrl = () => {
        return [
            { label: $localize `Starts with`, value: 'startsWith' },
            { label: $localize `Contains`, value: 'contains' },
            { label: $localize `Not contains`, value: 'notContains' },
            { label: $localize `Ends with`, value: 'endsWith' },
        ]
    }
}
