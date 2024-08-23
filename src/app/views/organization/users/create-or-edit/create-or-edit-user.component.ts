import { Component, DestroyRef, inject, OnInit, ViewChild } from '@angular/core';
import { OrganizationService } from '../../../../services/organization.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserProfile, UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Slug } from '../../../../utils/types.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageUtils } from '../../../../utils/message.utils';
import { CountriesUtils } from '../../../../utils/countries.utils';
import { FileSelectEvent, FileUpload } from 'primeng/fileupload';
import { deepEquals } from '../../../../utils/deep-equals';

@Component({
    templateUrl: './create-or-edit-user.component.html',
})
export class CreateOrEditUserComponent implements OnInit {

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

    nextAvatar: File | undefined;
    nextAvatarPreview: string = '';

    isInvitingNewUser: boolean = false;

    currentOrgSlug: Slug | undefined;

    userBeingModified: User | undefined;
    userSavedState: UserProfile | undefined;

    saving: boolean = false;

    get organizationName$(): Observable<string> {
        return this.organizationService.currentOrganization$.pipe(map(org => org?.name || ''));
    }

    constructor(private organizationService: OrganizationService,
                private userService: UserService,
                private router: Router,
                private confirmationService: ConfirmationService,
                private messageService: MessageService,
                private activatedRoute: ActivatedRoute) {
    }

    async ngOnInit() {

        const userFoundInUrl: string = this.activatedRoute.snapshot.params['user'];
        this.countries = CountriesUtils.countries;

        this.organizationService.currentOrganization$.pipe(
            map(org => {
                this.currentOrgSlug = org?.slug;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this.isInvitingNewUser = !userFoundInUrl;

        await this.fetchUserAndInitForms();
    }

    private async fetchUserAndInitForms() {

        const userFoundInUrl: string = this.activatedRoute.snapshot.params['user'];
        if (userFoundInUrl) {
            this.userBeingModified = await this.userService.getUserById(userFoundInUrl);

            this.nextAvatar = undefined;
            this.nextAvatarPreview = '';

            if (this.userBeingModified) {
                this.userForm.patchValue(this.userBeingModified);
                this.userForm.get('email')?.disable(); // not permitting email modification on behalf of user

                this.userSavedState = this.userForm.value;
            }
        }
    }

    async avatarSelection(e: FileSelectEvent) {
        if (!e?.currentFiles?.length) throw new Error('No file selected');

        const file = e.currentFiles[0];
        this.nextAvatar = file;

        // Logic required to display the image preview
        const reader: FileReader = new FileReader();

        reader.onload = (e) => {
            this.nextAvatarPreview = e.target?.result as string;
        };

        reader.readAsDataURL(file);
    }

    cancelAvatarSelection(input: FileUpload) {
        this.nextAvatar = undefined;
        this.nextAvatarPreview = '';

        input.clear();
    }

    canSaveAvatar() {
        return !!this.nextAvatar;
    }

    canSaveProfile() {
        return this.userForm.valid
            && this.userForm.dirty
            && !deepEquals(this.userForm.value, this.userSavedState) && !this.saving;
    }

    async onSubmit() {
        if (this.isInvitingNewUser) {

            // Wrapping invitation with confirm dialog
            this.confirmationService.confirm({
                key: 'confirm-invitation',
                accept: async () => {
                    this.saving = true;
                    await this.userService.createUser({
                        ...this.userForm.value,
                        organization: this.currentOrgSlug
                    }).then(async (userCreated) => {
                        await this.router.navigate(
                            ['/organization', this.currentOrgSlug, 'users', 'list'],
                            { state: { userInvited: true } }
                        );
                    }).catch((err) => {
                        console.error(err);

                        MessageUtils.parseServerError(this.messageService, err, {
                            summary: $localize `Error creating user`,
                        });

                    }).finally(() => this.saving = false);
                }
            });

        } else if (this.userBeingModified) {
            this.saving = true;

            // Relevant to save avatar
            if (this.canSaveAvatar() && this.nextAvatar) {
                await this.userService.uploadAvatar(this.userBeingModified._id, this.nextAvatar).then((avatar) => {

                    this.messageService.add({
                        severity: 'success',
                        summary: $localize `Success updating avatar`,
                        detail: $localize `It may not be visible immediately for other users.`,
                        life: 5000
                    });

                }).catch((err) => {
                    console.error(err);

                    MessageUtils.parseServerError(this.messageService, err, {
                        summary: $localize`Error updating avatar`,
                    });
                });
            }

            // Relevant to save profile
            if (this.canSaveProfile()) {
                await this.userService.updateUser(this.userBeingModified._id, this.userForm.value).then((user) => {

                    this.userSavedState = this.userForm.value;

                    this.messageService.add({
                        severity: 'success',
                        summary: $localize`Success updating user`,
                        detail: $localize`Some changes may take a few minutes to be effective.`,
                        life: 3000,
                    });

                }).catch((err) => {
                    console.error(err);

                    MessageUtils.parseServerError(this.messageService, err, {
                        summary: $localize`Error updating user`,
                    });
                });
            }

            this.saving = false;
            await this.fetchUserAndInitForms();

        }
    }

}
