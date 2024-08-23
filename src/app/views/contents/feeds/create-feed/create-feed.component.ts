import { Component, OnInit, OnDestroy } from '@angular/core';
import { MessageService } from 'primeng/api';
import { Member } from 'src/app/demo/api/member';
import { DialogConfig, Feed, FeedService } from '../service/feed.service';
import { MemberService } from 'src/app/demo/service/member.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-create-feed',
    templateUrl: './create-feed.component.html',
    providers: [MessageService]
})
export class CreateFeedComponent implements OnInit, OnDestroy {

    feed!: Feed;

    members: Member[] = [];

    filteredMembers: Member[] = [];

    dialogConfig: DialogConfig = {header: '', visible: false};

    subscription: Subscription;

    dialogSubscription: Subscription;

    availableGranularity: any[] = [];

    get creation(): boolean {
        return !!this.dialogConfig.newFeed;
    }

    constructor(private memberService: MemberService, private messageService: MessageService, private feedService: FeedService) {
        this.subscription = this.feedService.selectedFeed$.subscribe(data => this.feed = data);
        this.dialogSubscription = this.feedService.dialogSource$.subscribe(data => {
            this.dialogConfig = data;

            if(this.dialogConfig.newFeed) {
                this.resetFeed();
            }
        });
    }

    ngOnInit(): void {

        this.availableGranularity = [
            { label: 'Minute(s)', value: 'minute' },
            { label: 'Hour(s)', value: 'hour' },
            { label: 'Day(s)', value: 'day' },
        ];

        this.memberService.getMembers().then(members => this.members = members);
        this.resetFeed();
    }

    filterMembers(event: any) {
        let filtered: Member[] = [];
        let query = event.query;

        for (let i = 0; i < this.members.length; i++) {
            let member = this.members[i];
            if (member.name?.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(member);
            }
        }

        this.filteredMembers = filtered;
    }

    canSave(): boolean {
        return !!(this.feed.name && this.feed.urls?.length && this.feed.scrapingFrequency && this.feed.scrapingGranularity);
    }

    save() {
        this.feed.id = Math.floor(Math.random() * 1000);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feed "${this.feed.name}" created successfully.` });
        this.feedService.addFeed(this.feed);
        this.feedService.closeDialog();
    }

    testAndSave() {
        // TODO preview some articles fetched from the feed
        this.feed.id = Math.floor(Math.random() * 1000);
        this.messageService.add({ severity: 'success', summary: 'Success', detail: `Feed "${this.feed.name}" created successfully.` });
        this.feedService.addFeed(this.feed);
        this.feedService.closeDialog();
    }

    cancelFeed(){
        this.resetFeed()
        this.feedService.closeDialog();
    }

    resetFeed() {
        this.feed = {
            id: this.feed && this.feed.id ? this.feed.id : Math.floor(Math.random() * 1000),
            description: '',
            scrapingFrequency: 30,
            scrapingGranularity: 'minute',
            scrapingEnabled: true,
            urls: []
        };
    }

    ngOnDestroy() {
        this.subscription.unsubscribe();
    }

}
