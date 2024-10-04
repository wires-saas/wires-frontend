import { Component, EventEmitter, Input, OnChanges, Output, SimpleChanges } from '@angular/core';
import { ButtonDirective } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { MessageModule } from 'primeng/message';
import { NgIf } from '@angular/common';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Folder, FolderService } from '../../../services/folder.service';
import { ErrorUtils } from '../../../utils/error.utils';

@Component({
    selector: 'app-explorer-edit-dialog',
    templateUrl: './edit-dialog.component.html',
    standalone: true,
    imports: [
        ButtonDirective,
        DialogModule,
        InputTextModule,
        MessageModule,
        NgIf,
        ReactiveFormsModule
    ]
})
export class ExplorerEditDialogComponent implements OnChanges {

    @Input() visible: boolean = false;
    @Input() selectedFolder: Folder | undefined;

    @Output() cancel: EventEmitter<void> = new EventEmitter<void>();
    @Output() confirm: EventEmitter<void> = new EventEmitter<void>();

    editFolderDialogOptions: {
        loading: boolean;
        error?: string;
    } = { loading: false }

    editFolderForm: FormGroup = new FormGroup({
        displayName: new FormControl<string>('', Validators.required),
        description: new FormControl<string>('')
    });

    constructor(private folderService: FolderService) { }

    ngOnChanges(changes: SimpleChanges) {
        const folder = changes['selectedFolder']?.currentValue;
        if (folder) {
            this.editFolderForm.setValue({
                displayName: folder.displayName,
                description: folder.description
            });
        }
    }

    private reset() {
        this.editFolderForm.reset();
        this.editFolderDialogOptions = { loading: false };
    }

    cancelFolderEdition() {
        this.cancel.emit();
        this.reset();
    }

    async confirmFolderEdition() {

        const displayName = this.editFolderForm.get('displayName')?.value;
        const description = this.editFolderForm.get('description')?.value;

        if (!this.selectedFolder) throw new Error('Folder is not set');
        if (!displayName) throw new Error('Display name is required');

        this.editFolderDialogOptions.loading = true;

        setTimeout(async () => {
            if (!this.selectedFolder) throw new Error('Folder is not set');
            if (!displayName) throw new Error('Display name is required');

            await this.folderService.updateFolder(
                this.selectedFolder.organization,
                this.selectedFolder.id,
                displayName,
                description
            ).then(() => {
                this.confirm.emit();
                this.reset();
            }).catch (err => {
                console.error(err);
                this.editFolderDialogOptions.error = ErrorUtils.getErrorMessage(err);
                this.editFolderDialogOptions.loading = false;
            });

        }, 1000);
    }

    openEditFolderDialog(folderId: Folder['id'], folderDisplayName: string, folderDescription: string) {
        this.editFolderForm.setValue({
            displayName: folderDisplayName,
            description: folderDescription
        });

        this.editFolderDialogOptions = { loading: false };
    }
}
