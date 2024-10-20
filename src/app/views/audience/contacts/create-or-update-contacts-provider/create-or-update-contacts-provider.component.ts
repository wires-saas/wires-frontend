import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogConfig, } from '../../../../services/feed.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MessageUtils } from '../../../../utils/message.utils';
import { deepClone } from '../../../../utils/deep-clone';
import {
    ContactsProvider,
    ContactsProviderType,
    ContactsService,
    CreateProviderDto
} from '../../../../services/contacts.service';

@Component({
    selector: 'app-create-or-update-contacts-provider',
    templateUrl: './create-or-update-contacts-provider.component.html',
})
export class CreateOrUpdateContactsProviderComponent implements OnInit {
    @Input() organizationSlug!: string;

    private destroyRef = inject(DestroyRef);

    provider!: ContactsProvider;

    dialogConfig: DialogConfig = { header: '', visible: false };

    saving: boolean = false;

    get creation(): boolean {
        return !!this.dialogConfig.isNew;
    }

    constructor(
        private messageService: MessageService,
        private contactsService: ContactsService,
    ) {}

    ngOnInit(): void {
        this.contactsService.selectedProvider$
            .pipe(
                map((data) => (this.provider = deepClone(data))),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.contactsService.dialogSource$
            .pipe(
                map((data) => {
                    this.dialogConfig = data;

                    if (this.dialogConfig.isNew) {
                        this.resetProvider();
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.resetProvider();
    }

    canSave(): boolean {
        return true;
    }

    async updateProvider() {
        this.saving = true;

        await this.contactsService
            .updateContactsProvider(this.organizationSlug, this.provider)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success`,
                    detail: $localize`Provider "${this.provider.displayName}" updated successfully.`,
                });

                this.contactsService.closeDialog();
            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error updating feed`,
                });
            })
            .finally(() => (this.saving = false));
    }

    async createProvider() {
        // TODO preview some articles fetched from the feed
        this.saving = true;

        await this.contactsService
            .createContactsProvider(this.organizationSlug, this.provider as any as CreateProviderDto)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success`,
                    detail: $localize`Provider "${this.provider.displayName}" created successfully.`,
                });

                this.contactsService.closeDialog();
            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error creating feed`,
                });
            })
            .finally(() => (this.saving = false));
    }

    cancelProvider() {
        this.resetProvider();
        this.contactsService.closeDialog();
    }

    resetProvider() {
        this.provider = {
            _id: '',
            isFavorite: false,
            organization: '',
            type: ContactsProviderType.Brevo,
            displayName: '',
            description: ''
        };
    }

    onClickURL(e: { value: string }) {
        window.open(e.value, '_blank');
    }
}
