import { Component, DestroyRef, inject, OnInit } from '@angular/core';
import { Block, BlockService } from '../../../services/block.service';
import { OrganizationService } from '../../../services/organization.service';
import { map } from 'rxjs/operators';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Router } from '@angular/router';
import { FolderService } from '../../../services/folder.service';

@Component({
    templateUrl: './blocks.component.html',
})
export class BlocksComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    blocks: Block[] = [];

    private currentOrgSlug: string | undefined;

    constructor(private blockService: BlockService,
                private organizationService: OrganizationService,
                private folderService: FolderService,
                private router: Router) { }

    ngOnInit() {

        this.organizationService.currentOrganization$
            .pipe(
                map(async (org) => {
                    this.currentOrgSlug = org?.slug;
                    if (org) {
                        this.blocks = await this.blockService.getBlocks(org.slug);
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();

    }

    async openEditor(block: Block) {
        await this.router.navigate(['/organization', this.currentOrgSlug, 'studio', 'blocks', block.id, 'editor']);
    }

    async loadBlocks(folderId: string | null) {
        if (!this.currentOrgSlug) throw new Error('Organization slug is not set');

        if (!folderId) {
            this.blocks = await this.blockService.getBlocks(this.currentOrgSlug);
        } else {
            this.blocks = await this.folderService.getFolderContent<Block>(this.currentOrgSlug, folderId);
        }
    }

}
