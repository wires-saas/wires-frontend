import {Component, DestroyRef, inject, OnInit} from '@angular/core';
import {Block, BlockService} from '../../../services/block.service';
import {OrganizationService} from '../../../services/organization.service';
import {map} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {Router} from '@angular/router';
import {FolderItemType, FolderService} from '../../../services/folder.service';
import {CreateBlock, ReadBlock, UpdateBlock,} from '../../../utils/permission.utils';
import {firstValueFrom} from 'rxjs';
import {AuthService} from '../../../services/auth.service';

@Component({
    templateUrl: './blocks.component.html',
})
export class BlocksComponent implements OnInit {
    private destroyRef = inject(DestroyRef);

    blocks: Block[] = [];

    canCreateBlock: boolean = false;
    canUpdateBlock: boolean = false;

    private currentOrgSlug: string | undefined;

    constructor(
        private authService: AuthService,
        private blockService: BlockService,
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
                        this.blocks = await this.blockService.getBlocks(
                            org.slug,
                        ).then(_ => _.items);

                        this.canCreateBlock = await firstValueFrom(
                            this.authService.hasPermission$(
                                CreateBlock,
                                org.slug,
                            ),
                        );

                        this.canUpdateBlock = await firstValueFrom(
                            this.authService.hasPermission$(
                                UpdateBlock,
                                org.slug,
                            ),
                        );
                    }
                }),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe();
    }

    async openEditor(block: Block) {
        // if (!this.canUpdateBlock) return;
        await this.router.navigate([
            '/organization',
            this.currentOrgSlug,
            'studio',
            'blocks',
            block.id,
            'editor',
        ]);
    }

    async loadBlocks(folderId: string | null) {
        if (!this.currentOrgSlug)
            throw new Error('Organization slug is not set');

        if (!folderId) {
            this.blocks = await this.blockService.getBlocks(
                this.currentOrgSlug,
            ).then(_ => _.items);
        } else {
            this.blocks = await this.folderService.getFolderContent<Block>(
                this.currentOrgSlug,
                folderId,
                FolderItemType.Block,
                true,
            );
        }
    }

    static permissions = [ReadBlock];
}
