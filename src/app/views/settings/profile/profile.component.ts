import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { OrganizationService } from '../../../services/organization.service';
import { User, UserService } from '../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ConfirmationService, MessageService } from 'primeng/api';
import { CountriesUtils } from '../../../utils/countries.utils';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { MessageUtils } from '../../../utils/message.utils';
import { deepEquals } from '../../../utils/deep-equals';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';

export interface UserProfile {
    firstName: string;
    lastName: string;
    email: string;
    street: string;
    city: string;
    zipCode: string;
    country: string;
}

@Component({
    templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {

    @ViewChild('fileUploadInput') fileUploadInput: FileUpload | undefined;

    private destroyRef = inject(DestroyRef);

    countries: any[] = [];

    userForm: FormGroup = new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        street: new FormControl(''),
        city: new FormControl(''),
        zipCode: new FormControl(''),
        country: new FormControl('FR'),
    });

    userSavedState: UserProfile | undefined;

    nextAvatar: File | undefined;
    nextAvatarPreview: string = '';

    saving: boolean = false;


    currentUser: User | undefined;

    constructor(private authService: AuthService,
                private organizationService: OrganizationService,
                private userService: UserService,
                private router: Router,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,
                private activatedRoute: ActivatedRoute) {
    }

    async ngOnInit() {
        this.countries = CountriesUtils.countries;
        await this.buildUserForm();
    }

    private async buildUserForm() {

        await this.authService.getProfile();
        this.currentUser = await firstValueFrom(this.authService.currentUser$);

        if (this.currentUser) {
            this.userForm.patchValue(this.currentUser);
            this.userForm.get('email')?.disable();
            this.userSavedState = this.userForm.value;
        }
    }

    canSaveAvatar() {
        return !!this.nextAvatar;
    }

    canSaveProfile() {
        return this.userForm.valid
            && this.userForm.dirty
            && !deepEquals(this.userForm.value, this.userSavedState) && !this.saving;
    }

    async avatarSelection(e: FileSelectEvent) {
        console.log(e.currentFiles);
        if (!e?.currentFiles?.length) throw new Error('No file selected');

        const file = e.currentFiles[0];
        this.nextAvatar = file;

        // Logic required to display the image preview
        const reader: FileReader = new FileReader();

        reader.onload = (e) => {
            this.nextAvatarPreview = e.target?.result as string;
        };

        // readAsArrayBuffer for sending image to backend

        reader.readAsDataURL(file);

        console.log(file);
    }

    cancelAvatarSelection(input: FileUpload) {
        this.nextAvatar = undefined;
        this.nextAvatarPreview = '';

        input.clear();
    }

    async onSubmit() {
        if (!this.currentUser) return;
        this.saving = true;

        // If saving avatar is relevant
        if (this.nextAvatar) {

            await this.userService.uploadAvatar(this.currentUser._id, this.nextAvatar).then((avatar) => {
                console.log('response', avatar);

                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success updating avatar`,
                    detail: $localize`It may not be visible immediately for other users.`,
                    life: 5000
                });

            }).catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error updating avatar`,
                });
            });
        }

        // If saving profile is relevant
        if (this.canSaveProfile()) {

            await this.userService.updateUser(this.currentUser._id, this.userForm.value).then((user) => {

                this.messageService.add({
                    severity: 'success',
                    summary: $localize`Success updating profile`,
                    detail: $localize`Some changes may not be visible until next login.`,
                    life: 5000
                });

                this.userSavedState = this.userForm.value;

            }).catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error updating profile`,
                });
            });

        }

        await this.authService.getProfile().then(async () => {
            this.currentUser = await firstValueFrom(this.authService.currentUser$);

            // resetting avatar
            if (this.nextAvatar) {
                this.nextAvatar = undefined;
                this.nextAvatarPreview = '';
                this.fileUploadInput?.clear();
            }
        }).catch((err) => {
            console.error(err);

            MessageUtils.parseServerError(this.messageService, err, {
                summary: $localize`Error refreshing profile`,
            });
        });

        this.saving = false;
    }

}
