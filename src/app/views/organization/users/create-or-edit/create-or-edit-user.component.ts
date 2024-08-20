import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../services/organization.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Slug } from '../../../../utils/types.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';
import { MessageUtils } from '../../../../utils/message.utils';
import { CountriesUtils } from '../../../../utils/countries.utils';

@Component({
    templateUrl: './create-or-edit-user.component.html',
})
export class CreateOrEditUserComponent implements OnInit {

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

    isInvitingNewUser: boolean = false;

    currentOrgSlug: Slug | undefined;

    userBeingModified: User | undefined;

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

        this.organizationService.currentOrganization$.pipe(
            map(org => {
                this.currentOrgSlug = org?.slug;
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

        this.isInvitingNewUser = !userFoundInUrl;

        if (userFoundInUrl) {
            this.userBeingModified = await this.userService.getUserById(userFoundInUrl);

            if (this.userBeingModified) {
                this.userForm.patchValue(this.userBeingModified);
                this.userForm.get('email')?.disable(); // not permitting email modification on behalf of user
            }
        }

        this.countries = CountriesUtils.countries;
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
            await this.userService.updateUser(this.userBeingModified._id, this.userForm.value).then((user) => {

                    this.messageService.add({
                        severity: 'success',
                        summary: $localize `Success updating user`,
                        detail: $localize `Some changes may take a few minutes to be effective.`,
                        life: 3000,
                    });
            }).catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize `Error updating user`,
                });
            }).finally(() => this.saving = false);
        }
    }

}
