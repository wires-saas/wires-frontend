import { ChangeDetectionStrategy, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
import { Menu } from 'primeng/menu';
import { Feed, FeedService } from '../../../../services/feed.service';
import { AuthService } from '../../../../services/auth.service';
import { firstValueFrom } from 'rxjs';
import { Role, RoleUtils } from '../../../../utils/role.utils';
import { OrganizationService } from '../../../../services/organization.service';
import { MessageUtils } from '../../../../utils/message.utils';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { Router } from '@angular/router';

@Component({
    selector: 'app-feed-list',
    templateUrl: './feed-list.component.html',
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class FeedListComponent implements OnInit {

    private destroyRef = inject(DestroyRef);

    @Input() feeds!: Feed[];

    @Input() title!: string;

    @ViewChild('menu') menu!: Menu;

    menuItems: MenuItem[] = [];

    clickedFeed!: Feed;

    constructor(private authService: AuthService,
                private messageService: MessageService,
                private confirmationService: ConfirmationService,
                private organizationService: OrganizationService,
                private feedService: FeedService,
                private router: Router) { }

    async ngOnInit() {

        this.organizationService.currentOrganization$.pipe(
            map(async (org) => {
                if (org) {
                    let canDelete = false;
                    const currentUser = await firstValueFrom(this.authService.currentUser$);

                    if (currentUser) {
                        const currentUserRole = RoleUtils.getRoleForOrganization(currentUser, org?.slug);
                        canDelete = currentUserRole === Role.ADMIN || currentUserRole === Role.SUPER_ADMIN;
                    }

                    this.menuItems = [
                        {
                            label: $localize `Fetch Articles`,
                            icon: 'pi pi-play-circle',
                            command: async () => await this.onPlayNow()
                        },
                        {
                            label: $localize `Edit`,
                            icon: 'pi pi-pencil',
                            command: () => this.onEdit()
                        },
                        {
                            label: $localize `Delete`,
                            icon: 'pi pi-trash',
                            disabled: !canDelete,
                            command: () => this.handleDelete()
                        }
                    ];
                }
            }),
            takeUntilDestroyed(this.destroyRef)
        ).subscribe();

    }

    async handleDelete() {

        this.confirmationService.confirm({
            key: 'confirm-delete-feed',
            acceptLabel: $localize `Confirm`,
            rejectLabel: $localize `Cancel`,
            accept: async () => {

                await this.feedService.removeFeed(this.clickedFeed.organization, this.clickedFeed._id).then(() => {
                    this.messageService.add({
                        severity: 'success',
                        summary: $localize`Success`,
                        detail: $localize`Feed has been deleted successfully.`
                    });
                }).catch((err) => {
                    console.error(err);
                    MessageUtils.parseServerError(this.messageService, err, {
                        summary: $localize`Error deleting feed`,
                    });
                });
            }
        });
    }

    toggleMenu(event: Event, feed: Feed) {
        this.clickedFeed = feed;
        this.menu.toggle(event);
    }

    onEdit() {
        this.feedService.onFeedSelect(this.clickedFeed);
        this.feedService.showDialog($localize `Edit Feed`, false);
    }

    async onPlayNow() {
        this.feedService.onFeedSelect(this.clickedFeed);

        await this.feedService.playFeed(this.clickedFeed.organization, this.clickedFeed).then(async (run) => {

            console.log(run);

            await this.router.navigate([
                'organization', this.clickedFeed.organization,
                'contents', 'feeds', run.feed,
                'runs', run._id]);

        }).catch((err) => {
            console.error(err);

            MessageUtils.parseServerError(this.messageService, err, {
                summary: $localize `Error playing feed`,
            });
        });
    }

    async onCheckboxChange(event: any, feed: Feed) {
        event.originalEvent.stopPropagation();
        await this.feedService.toggleFeed(feed.organization, feed._id, event.checked).then(() => {

            const detail = event.checked ? $localize `Feed "${feed.displayName}" enabled.` : $localize `Feed "${feed.displayName}" disabled.`;

            this.messageService.add({
                severity: 'info',
                summary: $localize `Success`,
                detail: detail
            });

        }).catch((err) => {
            console.error(err);
            const summary = event.checked ? $localize `Error enabling feed` : $localize `Error disabling feed`;

            MessageUtils.parseServerError(this.messageService, err, {
                summary: summary,
            });
        })
    }

    autoScrapingRelevant(feed: Feed) {
        return !!(feed.scrapingEnabled
            && feed.autoScrapingEnabled
            && feed.autoScrapingInterval
            && feed.autoScrapingGranularity
            && feed.autoScrapingInterval !== feed.scrapingInterval);
    }
}
