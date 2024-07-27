import { Component, ElementRef, inject, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Organization, OrganizationService } from '../services/organization.service';
import { ActivatedRoute, Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { Slug } from '../utils/types.utils';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent implements OnInit {
    timeout: any = null;

    availableOrganizations: Organization[] = [];
    selectedOrganization: Organization | undefined = undefined;

    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(public layoutService: LayoutService,
                public el: ElementRef,
                private router: Router,
                private activatedRoute: ActivatedRoute,
                private organizationService: OrganizationService) {}

    async ngOnInit() {

        // Fetching all organizations
        // setTimeout(() => {
            this.organizationService.getAll().then(organizations => {
                this.availableOrganizations = organizations;

                if (this.availableOrganizations?.length === 1) {
                    // if only one organization, select it
                    this.selectedOrganization = this.availableOrganizations[0];

                } else if (this.availableOrganizations?.length > 1) {

                    // if multiple organizations, select the one in the URL
                    console.log(this.activatedRoute.snapshot.url);

                    const slugInUrl: Slug = this.activatedRoute.snapshot.params['slug'];
                    console.log('slugInUrl', slugInUrl);

                    this.selectedOrganization = this.availableOrganizations.find(org => org.slug === slugInUrl);

                    // if organization in URL matches none, force select first
                    if (!this.selectedOrganization) {
                        this.selectedOrganization = this.availableOrganizations[0];
                    }
                } else {
                    // if no organization, redirect to unauthorized
                    this.router.navigate(['/auth/unauthorized']);
                }

                if (this.selectedOrganization) this.organizationService.setCurrentOrganization(this.selectedOrganization);
            });
        // }, 1000);
    }

    async onOrganizationChange() {
        if (this.selectedOrganization) {

            const previousOrganization = await firstValueFrom(this.organizationService.currentOrganization$);

            this.organizationService.setCurrentOrganization(this.selectedOrganization);

            if (previousOrganization && this.router.url.includes(previousOrganization.slug)) {
                console.log('rewriting url');
                await this.router.navigateByUrl(
                    this.router.url.replace(
                        `/${previousOrganization.slug}/`,
                        `/${this.selectedOrganization.slug}/`
                    ));
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
                this.timeout = setTimeout(() => this.layoutService.state.sidebarActive = false, 300);
            }
        }
    }

    anchor() {
        this.layoutService.state.anchored = !this.layoutService.state.anchored;
    }

}
