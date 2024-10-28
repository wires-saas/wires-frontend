import { Component, EventEmitter, Input, Output } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { NgIf } from '@angular/common';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { Folder, FolderService } from '../../../services/folder.service';
import { Slug } from '../../../utils/types.utils';
import { ErrorUtils } from '../../../utils/error.utils';

@Component({
    selector: 'app-explorer-create-dialog',
    templateUrl: './create-dialog.component.html',
    standalone: true,
    imports: [
        ButtonDirective,
        DialogModule,
        InputTextModule,
        MessageModule,
        NgIf,
        ReactiveFormsModule,
    ],
})
export class ExplorerCreateDialogComponent {
    @Input() visible: boolean = false;
    @Input() selectedFolder: Folder | undefined;
    @Input() organization: Slug | undefined;

    @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

    createFolderDialogOptions: {
        loading: boolean;
        error?: string;
    } = { loading: false };

    createFolderForm: FormGroup = new FormGroup({
        displayName: new FormControl<string>('', Validators.required),
        description: new FormControl<string>(''),
    });

    constructor(private folderService: FolderService) {}

    private reset() {
        this.createFolderForm.reset();
        this.createFolderDialogOptions = { loading: false };
    }

    cancelFolderCreation() {
        this.cancel.emit();
        this.reset();
    }

    async confirmFolderCreation() {
        const displayName = this.createFolderForm.get('displayName')?.value;
        const description = this.createFolderForm.get('description')?.value;

        if (!displayName) throw new Error('Display name is required');
        if (!this.organization) throw new Error('Organization is not set');

        this.createFolderDialogOptions.loading = true;

        setTimeout(async () => {
            if (!displayName) throw new Error('Display name is required');
            if (!this.organization) throw new Error('Organization is not set');

            await this.folderService
                .createFolder(
                    this.organization!,
                    displayName,
                    description,
                    this.selectedFolder?.id || null,
                )
                .then(() => {
                    this.confirm.emit();
                    this.reset();
                })
                .catch((err) => {
                    console.error(err);
                    this.createFolderDialogOptions.error =
                        ErrorUtils.getErrorMessage(err);
                    this.createFolderDialogOptions.loading = false;
                });
        }, 1000);
    }
}
