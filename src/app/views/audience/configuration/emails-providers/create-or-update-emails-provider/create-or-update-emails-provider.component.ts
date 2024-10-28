import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
import { MessageService } from 'primeng/api';
import { DialogConfig } from '../../../../../services/feed.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { MessageUtils } from '../../../../../utils/message.utils';
import { deepClone } from '../../../../../utils/deep-clone';
import {
    CreateEmailsProviderDto,
    EmailsProvider,
    EmailsProviderType,
    EmailsService,
} from '../../../../../services/emails.service';

@Component({
    selector: 'app-create-or-update-emails-provider',
    templateUrl: './create-or-update-emails-provider.component.html',
})
export class CreateOrUpdateEmailsProviderComponent implements OnInit {
    @Input() organizationSlug!: string;

    private destroyRef = inject(DestroyRef);

    provider!: EmailsProvider;

    dialogConfig: DialogConfig = { header: '', visible: false };

    saving: boolean = false;

    get creation(): boolean {
        return !!this.dialogConfig.isNew;
    }

    constructor(
        private messageService: MessageService,
        private emailsService: EmailsService,
    ) {}

    ngOnInit(): void {
        this.emailsService.selectedProvider$
            .pipe(
                map((data) => (this.provider = deepClone(data))),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        this.emailsService.dialogSource$
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

        await this.emailsService
            .updateEmailsProvider(this.organizationSlug, this.provider)
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success`,
                    detail: $localize`Provider "${this.provider.displayName}" updated successfully.`,
                });

                this.emailsService.closeDialog();
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
        this.saving = true;

        await this.emailsService
            .createEmailsProvider(
                this.organizationSlug,
                this.provider as any as CreateEmailsProviderDto,
            )
            .then(() => {
                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success`,
                    detail: $localize`Provider "${this.provider.displayName}" created successfully.`,
                });

                this.emailsService.closeDialog();
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
        this.emailsService.closeDialog();
    }

    resetProvider() {
        this.provider = {
            id: '',
            isDefault: false,
            isVerified: false,
            organization: '',
            type: EmailsProviderType.Mailjet,
            displayName: '',
            description: '',
            senders: [],
            domains: [],
        };
    }

    onClickURL(e: { value: string }) {
        window.open(e.value, '_blank');
    }
}
