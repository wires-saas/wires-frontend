import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {OrganizationService} from '../../../services/organization.service';
import {map} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {FolderItemType, FolderService} from '../../../services/folder.service';
import {CreateTemplate, ReadTemplate, UpdateTemplate,} from '../../../utils/permission.utils';
import {firstValueFrom} from 'rxjs';
import {AuthService} from '../../../services/auth.service';
import {Template, TemplateService} from "../../../services/template.service";

@Component({
    templateUrl: './templates.component.html',
})
export class TemplatesComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    templates: Template[] = [];

    canCreateTemplate: boolean = false;
    canUpdateTemplate: boolean = false;

    private currentOrgSlug: string | undefined;

    constructor(
        private authService: AuthService,
        private templateService: TemplateService,
        private organizationService: OrganizationService,
        private folderService: FolderService,
        private router: Router,
    ) {}

    ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                map(async (org) => {
                    this.currentOrgSlug = org?.slug;
                    if (org) {
                        this.templates = await this.templateService.getTemplates(
                            org.slug,
                        );

                        this.canCreateTemplate = await firstValueFrom(
                            this.authService.hasPermission$(
                                CreateTemplate,
                                org.slug,
                            ),
                        );

                        this.canUpdateTemplate = await firstValueFrom(
                            this.authService.hasPermission$(
                                UpdateTemplate,
                                org.slug,
                            ),
                        );
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    async openEditor(template: Template) {
        await this.router.navigate([
            '/organization',
            this.currentOrgSlug,
            'studio',
            'templates',
            template.id,
            'editor',
        ]);
    }

    async loadTemplates(folderId: string | null) {
        if (!this.currentOrgSlug)
            throw new Error('Organization slug is not set');

        if (!folderId) {
            this.templates = await this.templateService.getTemplates(
                this.currentOrgSlug,
            );
        } else {
            this.templates = await this.folderService.getFolderContent<Template>(
                this.currentOrgSlug,
                folderId,
                FolderItemType.Template
            );
        }
    }

    static permissions = [ReadTemplate];
}
