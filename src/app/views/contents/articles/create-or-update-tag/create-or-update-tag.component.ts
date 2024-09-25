import { Component, OnInit, inject, DestroyRef, Input, EventEmitter, Output } from '@angular/core';
import { MessageService } from 'primeng/api';
import { MessageUtils } from '../../../../utils/message.utils';
import { Tag, TagService } from '../../../../services/tag.service';

@Component({
    selector: 'app-create-or-update-tag',
    templateUrl: './create-or-update-tag.component.html',
})
export class CreateOrUpdateTagComponent implements OnInit {
    @Input() organizationSlug!: string;

    @Input() visible: boolean = false;
    @Input() header: string = '';
    @Input() creatingTag: boolean = false;
    @Input() tag!: Tag;

    @Output() closeDialog: EventEmitter<boolean> = new EventEmitter<boolean>();

    availableSeverities = [
        {
            label: $localize `Default`,
            value: ''
        },
        {
            label: $localize `Blue`,
            value: 'info',
        },
        {
            label: $localize `Green`,
            value: 'success',
        },
        {
            label: $localize `Orange`,
            value: 'warning',
        },
        {
            label: $localize `Red`,
            value: 'danger',
        },
    ];

    get selectedSeverityLabel() {
        return this.availableSeverities.find(severity => severity.value === this.tag.color)?.label;
    }

    private destroyRef = inject(DestroyRef);

    saving: boolean = false;

    constructor(
        private messageService: MessageService,
        private tagService: TagService,
    ) {}

    ngOnInit(): void {
        this.resetTag();
    }

    canSave(): boolean {
        return !!this.tag;
    }

    async updateTag() {
        this.saving = true;

        await this.tagService
            .putTag(this.organizationSlug, this.tag)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success`,
                    detail: $localize`Tag "${this.tag.displayName}" updated successfully.`,
                });


            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error updating feed`,
                });
            })
            .finally(() => (this.saving = false));
    }

    async createTag() {
        // TODO preview some articles fetched from the feed
        this.saving = true;

        await this.tagService
            .putTag(this.organizationSlug, this.tag)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success`,
                    detail: $localize`Tag "${this.tag.displayName}" created successfully.`,
                });

                this.closeDialog.emit(true);
            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error creating tag`,
                });
            })
            .finally(() => (this.saving = false));
    }

    cancel() {
        this.resetTag();
        this.visible = false;
    }

    resetTag() {
        this.tag = {
            displayName: '',
            description: '',
            color: '',
            organization: this.organizationSlug,
            ruleset: [],
        };
    }
}
