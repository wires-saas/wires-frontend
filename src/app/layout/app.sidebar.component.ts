import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { LayoutService } from './service/app.layout.service';
import { Organization, OrganizationService } from '../services/organization.service';

@Component({
    selector: 'app-sidebar',
    templateUrl: './app.sidebar.component.html'
})
export class AppSidebarComponent implements OnInit {
    timeout: any = null;

    availableOrganizations: Organization[] = [];
    selectedOrganization: Organization | undefined = undefined;

    @ViewChild('menuContainer') menuContainer!: ElementRef;
    constructor(public layoutService: LayoutService, public el: ElementRef, private organizationService: OrganizationService) {}

    async ngOnInit() {
        this.organizationService.getAll().then(organizations => {
            this.availableOrganizations = organizations;
            this.selectedOrganization = this.availableOrganizations[0];
            this.organizationService.setCurrentOrganization(this.selectedOrganization);
        });
    }

    onOrganizationChange() {
        if (this.selectedOrganization) {
            this.organizationService.setCurrentOrganization(this.selectedOrganization);
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
