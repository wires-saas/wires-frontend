import {
    Component,
    DestroyRef,
    ElementRef,
    inject,
    OnInit,
    ViewChild,
} from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import {
    Organization,
    OrganizationService,
} from '../services/organization.service';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html',
})
export class AppSidebarComponent implements OnInit {
    timeout: any = null;

    availableOrganizations: Organization[] = [];
    selectedOrganization: Organization | undefined = undefined;

    get lightMode(): boolean {
        return this.layoutService.isLightMode();
    }

    private destroyRef = inject(DestroyRef);

    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(
        public layoutService: LayoutService,
        public el: ElementRef,
        private router: Router,
        private organizationService: OrganizationService,
    ) {}

    async ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map((organization) => {
                    if (organization) {
                        this.selectedOrganization =
                            this.availableOrganizations.find(
                                (org) => org.slug === organization.slug,
                            );
                    } else {
                        this.selectedOrganization = undefined;
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

        // Fetching all organizations
        this.organizationService.getAll()
            .then((organizations) => this.setupOrganizationsSelect(organizations));

        // Refreshing organizations on change
        this.organizationService.organizationsChanged$.pipe(
            map(() => {
                this.organizationService.getAll()
                    .then((organizations) => this.setupOrganizationsSelect(organizations));
            }),
            takeUntilDestroyed(this.destroyRef),
        ).subscribe();
    }

    private async setupOrganizationsSelect(organizations: Organization[]) {
        console.log('organizations', organizations);
        this.availableOrganizations = organizations;

        if (this.availableOrganizations?.length === 1) {
            // if only one organization, select it
            this.selectedOrganization = this.availableOrganizations[0];
        } else if (this.availableOrganizations?.length > 1) {
            // if multiple organizations, select the one in the URL
            const url = this.router.url;
            const regex = /\/organization\/([^\/]+)/;
            const match = url.match(regex);
            const slugInUrl = match && match[1];

            this.selectedOrganization = this.availableOrganizations.find(
                (org) => org.slug === slugInUrl,
            );

            // if organization in URL matches none, force select first
            if (!this.selectedOrganization) {
                this.selectedOrganization = this.availableOrganizations[0];
            }
        } else {
            // if no organization, redirect to unauthorized
            this.router.navigate(['/auth/unauthorized']);
        }

        if (this.selectedOrganization)
            this.organizationService.setCurrentOrganization(
                this.selectedOrganization,
            );
    }

    async onOrganizationChange() {
        if (this.selectedOrganization) {
            const previousOrganization = await firstValueFrom(
                this.organizationService.currentOrganization$,
            );

            this.organizationService.setCurrentOrganization(
                this.selectedOrganization,
            );

            if (
                previousOrganization &&
                this.router.url.includes(previousOrganization.slug)
            ) {
                await this.router.navigateByUrl(
                    this.router.url.replace(
                        `/${previousOrganization.slug}/`,
                        `/${this.selectedOrganization.slug}/`,
                    ),
                );
            }
        }
    }

    onMouseEnter() {
        if (!this.layoutService.state.anchored) {
            if (this.timeout) {
                clearTimeout(this.timeout);
                this.timeout = null;
            }
            this.layoutService.state.sidebarActive = true;
        }
    }

    onMouseLeave() {
        if (!this.layoutService.state.anchored) {
            if (!this.timeout) {
                this.timeout = setTimeout(
                    () => (this.layoutService.state.sidebarActive = false),
                    300,
                );
            }
        }
    }
}
