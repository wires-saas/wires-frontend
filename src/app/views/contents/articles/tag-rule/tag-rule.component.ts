import { Component, Input, OnInit } from '@angular/core';
import { TagRule } from '../../../../services/tag.service';

@Component({
    selector: 'app-tag-rule',
    templateUrl: './tag-rule.component.html',
})
export class TagRuleComponent implements OnInit {
    @Input() rule!: TagRule;

    isMetadata: boolean = false;
    metadataName: string = '';

    ngOnInit() {
        this.isMetadata = this.rule.field.startsWith('metadata.');
        if (this.isMetadata) {
            this.metadataName = this.rule.field.split('.')[1];
        }
    }

    getValueType(value: any): string {
        try {
            const dateParsed = new Date(value).getTime();

            if (dateParsed && !isNaN(dateParsed)) return 'date';
        } catch (e) {
            // nothing
        }

        return typeof value;
    }
}
