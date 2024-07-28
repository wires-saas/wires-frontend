import { AfterViewInit, Component, DestroyRef, inject, OnInit } from '@angular/core';
import { OrganizationService } from '../../../../services/organization.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { User, UserService } from '../../../../services/user.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Slug } from '../../../../utils/types.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ConfirmationService, MessageService } from 'primeng/api';

@Component({
    templateUrl: './create-or-edit-user.component.html',
})
export class CreateOrEditUserComponent implements OnInit, AfterViewInit {

    private destroyRef = inject(DestroyRef);

    countries: any[] = [];

    userCountry: any = {name: 'France', code: 'FR'};

    userForm: FormGroup = new FormGroup({
        firstName: new FormControl('', Validators.required),
        lastName: new FormControl('', Validators.required),
        email: new FormControl('', [Validators.required, Validators.email]),
        street: new FormControl(''),
        city: new FormControl(''),
        zipCode: new FormControl(''),
        country: new FormControl(''),
    });

    isInvitingNewUser: boolean = false;

    currentOrgSlug: Slug | undefined;

    userBeingModified: User | undefined;

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

        this.countries = [
            {name: 'Australia', code: 'AU'},
            {name: 'Brazil', code: 'BR'},
            {name: 'China', code: 'CN'},
            {name: 'Egypt', code: 'EG'},
            {name: 'France', code: 'FR'},
            {name: 'Germany', code: 'DE'},
            {name: 'India', code: 'IN'},
            {name: 'Japan', code: 'JP'},
            {name: 'Spain', code: 'ES'},
            {name: 'United States', code: 'US'}
        ];
    }

    async ngAfterViewInit() {
        if (!!this.activatedRoute.snapshot.queryParams['newlyCreated']) {
            this.messageService.add({
                severity: 'success',
                summary: 'Success inviting user',
                detail: 'User has been invited by email to join !',
                life: 5000
            });
        }
    }

    async onSubmit() {
        if (this.isInvitingNewUser) {

            // Wrapping invitation with confirm dialog
            this.confirmationService.confirm({
                key: 'confirm-invitation',
                accept: async () => {
                    await this.userService.createUser(this.userForm.value).then(async (userCreated) => {
                        await this.router.navigate(
                            ['/organization', this.currentOrgSlug, 'users', userCreated._id, 'edit'],
                            { queryParams: { newlyCreated: true }}
                        );
                    }).catch((err) => {
                        console.error(err);
                        this.messageService.add({
                            severity: 'error',
                            summary: 'Error creating user',
                            detail: `${err.statusText} (${err.status})`,
                            life: 3000
                        });

                    })
                }
            });

        } else if (this.userBeingModified) {
            await this.userService.updateUser(this.userBeingModified._id, this.userForm.value);
        }
    }

}
