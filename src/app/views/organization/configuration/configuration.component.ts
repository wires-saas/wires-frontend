import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import {
    Organization,
    OrganizationService,
} from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormControl, FormGroup } from '@angular/forms';
import { deepEquals } from '../../../utils/deep-equals';
import { MessageUtils } from '../../../utils/message.utils';
import { MessageService } from 'primeng/api';
import { User } from '../../../services/user.service';
import { AuthService } from '../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { UpdateOrganization, UpdateUserRole } from '../../../utils/permission.utils';

interface OrganizationSecurity {
    twoFactorAuthenticationEnabled: boolean;
    twoFactorAuthenticationMethods: string[];
}

@Component({
    templateUrl: './configuration.component.html',
})
export class ConfigurationComponent implements OnInit {

    optionsFor2FA = [
        { name: $localize`Email`, id: 'email' },
        {
            name: $localize`SMS (not yet implemented)`,
            id: 'sms',
            disabled: true,
        },
    ];

    securityForm: FormGroup = new FormGroup({
        twoFactorAuthenticationEnabled: new FormControl(false),
        twoFactorAuthenticationMethods: new FormControl([]),
    });
    securitySavedState: OrganizationSecurity | undefined;

    aiForm: FormGroup = new FormGroup({
        enabled: new FormControl({ value: false, disabled: true }),
    });

    currentOrgSlug: string | undefined;
    public currentUser: User | undefined = undefined;

    private destroyRef = inject(DestroyRef);

    constructor(
        private organizationService: OrganizationService,
        private authService: AuthService,
        private messageService: MessageService,
    ) {}

    async ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map(async (organization: Organization | undefined) => {
                    this.currentOrgSlug = organization?.slug;
                    if (organization) {
                        // Populating form fields

                        Object.entries(organization.security).forEach(
                            ([key, value]) => {
                                if (this.securityForm.get(key)) {
                                    this.securityForm.get(key)?.setValue(value);
                                }
                            },
                        );

                        this.securitySavedState = this.securityForm.value;

                        this.aiForm.get('enabled')?.setValue(!!organization.gpt);

                        this.currentUser = await firstValueFrom(
                            this.authService.currentUser$,
                        );
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    canSaveSecurity() {
        return (
            this.securityForm.valid &&
            this.securityForm.dirty &&
            !deepEquals(this.securityForm.value, this.securitySavedState)
        );
    }

    async updateSecurity() {
        if (!this.currentOrgSlug)
            throw new Error('cannot update organization without slug');
        await this.organizationService
            .update(this.currentOrgSlug, {
                security: this.securityForm.value,
            })
            .then(() => {
                this.securitySavedState = this.securityForm.value;

                this.messageService.add({
                    severity: 'info',
                    detail: $localize`Security settings updated successfully`,
                    life: 3000,
                });
            })
            .catch((err) => {
                console.error(err);

                MessageUtils.parseServerError(this.messageService, err, {
                    summary: $localize`Error updating security settings`,
                });
            });
    }

    static permissions = [UpdateOrganization, UpdateUserRole];
}
