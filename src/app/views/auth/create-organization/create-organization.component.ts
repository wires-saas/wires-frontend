import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {LayoutService} from 'src/app/layout/service/app.layout.service';
import {ActivatedRoute, Router} from '@angular/router';
import {AuthService} from '../../../services/auth.service';
import {PasswordUtils} from '../../../utils/password.utils';
import {PlanType} from "../../../services/organization.service";
import {FormControl, FormGroup, Validators} from "@angular/forms";
import {map} from "rxjs/operators";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";
import {SlugAvailableValidator} from "../../../utils/validators/slug-available.validator";

@Component({
    templateUrl: './create-organization.component.html',
})
export class CreateOrganizationComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    isWaitingServer: boolean = false;
    errorDialogVisible: boolean = false;
    successDialogVisible: boolean = false;

    token: string = '';

    plan: PlanType = PlanType.FREE;
    requiresOwnerCreation: boolean = false;
    futureOwner: string = '';

    organizationForm: FormGroup<{ organizationName: FormControl<string>; organizationSlug: FormControl<string> }>;

    password: string = '';
    passwordConfirmation: string = '';

    mediumRegex: string = PasswordUtils.MEDIUM_STRING;
    strongRegex: string = PasswordUtils.STRONG_STRING;

    get passwordLengthOK(): boolean {
        return this.password.length >= 12;
    }

    get passwordUppercaseOK(): boolean {
        return /[A-Z]/.test(this.password);
    }

    get passwordLowercaseOK(): boolean {
        return /[a-z]/.test(this.password);
    }

    get passwordDigitOK(): boolean {
        return /[0-9]/.test(this.password);
    }

    get passwordSpecialCharOK(): boolean {
        return /[^A-Za-z0-9]/.test(this.password);
    }

    get passwordValid(): boolean {
        return (
            this.password === this.passwordConfirmation &&
            this.passwordLengthOK &&
            this.passwordUppercaseOK &&
            this.passwordLowercaseOK &&
            this.passwordDigitOK &&
            this.passwordSpecialCharOK
        );
    }

    get canSubmit(): boolean {

        if (this.requiresOwnerCreation) {
            return this.passwordValid && this.organizationForm.valid;
        } else {
            return this.organizationForm.valid;
        }

    }

    constructor(
        private layoutService: LayoutService,
        private router: Router,
        private activatedRoute: ActivatedRoute,
        private authService: AuthService,
        private slugAvailableValidator: SlugAvailableValidator,
    ) {
        this.organizationForm = new FormGroup({
            organizationName: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(2), Validators.maxLength(255),
                    Validators.pattern(/^[a-zA-Z0-9]*$/)
                ]
            }),
            organizationSlug: new FormControl('', {
                nonNullable: true,
                validators: [
                    Validators.required,
                    Validators.minLength(3), Validators.maxLength(32),
                    Validators.pattern(/^[a-z]*$/)
                ],
                asyncValidators: this.slugAvailableValidator.validate,
            }),
        });
    }

    get buttonLabel(): string {
        if (this.isWaitingServer) return $localize`Creating organization...`;
        else return $localize`Create organization`;
    }

    get dark(): boolean {
        return this.layoutService.config().colorScheme !== 'light';
    }

    async ngOnInit() {

        this.token = this.activatedRoute.snapshot.queryParams['token'];

        const check = await this.authService.checkOrganizationCreationInviteToken(this.token);
        this.plan = check.plan;
        this.requiresOwnerCreation = check.requiresOwnerCreation;
        this.futureOwner = check.owner;

        this.organizationForm.get('organizationSlug')?.valueChanges.pipe(
            map((value) => {
                this.organizationForm.get('organizationSlug')?.setValue(value.toLowerCase(), {emitEvent: false});
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

    }

    async submit() {

        if (!this.canSubmit || this.isWaitingServer) {
            return;
        }

        this.disableForm();

        let creationApiCall: Promise<void>;
        if (!this.requiresOwnerCreation) {
            creationApiCall = this.authService.useOrganizationCreationInviteToken(
                this.token,
                this.organizationForm.value.organizationName as string,
                this.organizationForm.value.organizationSlug as string,
            );
        } else {
            creationApiCall = this.authService.useOrganizationCreationInviteTokenWithUserCreation(
                this.token,
                this.organizationForm.value.organizationName as string,
                this.organizationForm.value.organizationSlug as string,
                this.password,
            );
        }

        await creationApiCall
            .then(() => {
                this.successDialogVisible = true;
            })
            .catch((err) => {
                console.error(err);
                this.errorDialogVisible = true;
                this.enableForm();
            })
            .finally(() => {
                this.isWaitingServer = false;
            });

    }

    async goToLogin() {
        await this.router.navigate(['auth/login']);
    }

    private enableForm() {
        this.organizationForm.enable();
        this.isWaitingServer = false;
    }

    private disableForm() {
        this.organizationForm.disable();
        this.isWaitingServer = true;
    }
}
