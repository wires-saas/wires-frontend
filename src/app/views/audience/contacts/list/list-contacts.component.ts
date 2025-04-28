import { Component, DestroyRef, inject, OnInit, Output, EventEmitter } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Table, TableLazyLoadEvent } from 'primeng/table';
import { OrganizationService } from '../../../../services/organization.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter, firstValueFrom } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationService, MenuItem, MessageService, SortEvent } from 'primeng/api';
import { Contact, ContactsQueryOptions, ContactsService, ContactStatus } from '../../../../services/contacts.service';
import { AuthService } from '../../../../services/auth.service';
import { MessageUtils } from '../../../../utils/message.utils';
import { CsvUtils } from '../../../../utils/csv.utils';
import { Slug } from '../../../../utils/types.utils';


@Component({
    selector: 'app-list-contacts',
    templateUrl: './list-contacts.component.html',
})
export class ListContactsComponent implements OnInit {

    private readonly DEFAULT_ROWS = 10;

    contacts: Contact[] = [];
    actionsMenuItems: MenuItem[] = [];
    currentOrgSlug: Slug | undefined;
    totalRecords = 0;
    loading = false;

    selectedContact: Contact | undefined;

    filterValue: string = '';
    page = 0;
    rows = this.DEFAULT_ROWS;
    statusFilter?: ContactStatus;
    sortField: string = '';
    sortOrder: number = -1;
    statusOptions = [
        { label: 'Active', value: ContactStatus.Active },
        { label: 'Unsubscribed', value: ContactStatus.Unsubscribed },
        { label: 'Bounced', value: ContactStatus.Bounced },
        { label: 'Spam', value: ContactStatus.Spam },
    ];
    
    canCreateContact: boolean = true;
    canUpdateContact: boolean = true;
    canDeleteContact: boolean = true;

    @Output() noContacts: EventEmitter<boolean> = new EventEmitter<boolean>();
    @Output() errorFetchingContacts: EventEmitter<boolean> = new EventEmitter<boolean>();

    private destroyRef = inject(DestroyRef);

    constructor(
        private authService: AuthService,
        private contactsService: ContactsService,
        private organizationService: OrganizationService,
        private confirmationService: ConfirmationService,
        private messageService: MessageService,
        private route: ActivatedRoute,
        private router: Router,
    ) {}

    ngOnInit() {
        this.organizationService.currentOrganization$
            .pipe(
                filter((org) => !!org),
                takeUntilDestroyed(this.destroyRef),
            )
            .subscribe((org) => {
                this.currentOrgSlug = org?.slug;
                if (org?.slug) {
                    this.reset();
                }
            });
    }

    async loadContacts(followReset: boolean) {
        if (!this.currentOrgSlug) return;
        this.loading = true;
        try {

            const options: ContactsQueryOptions = {
                page: this.page,
                limit: this.rows,
            };

            if (this.filterValue) {
                options.email = this.filterValue;
            }

            if (this.statusFilter) {
                options.status = this.statusFilter;
            }

            if (this.sortField) {
                options.sortField = this.sortField;
                options.sortOrder = this.sortOrder;
            }

            const result = await this.contactsService.getContacts(this.currentOrgSlug, options);

            if (followReset && result.data.length === 0) {
                this.noContacts.emit(true);
            } else {
                this.contacts = result.data;
                this.totalRecords = result.total;
            }
        } catch (error: any) {

            // error handling depends on if the request to load contacts was triggered by a reset (= default parameters) or not
            if (followReset) {
                this.errorFetchingContacts.emit(true);
            } else {
                this.messageService.add({
                    severity: 'error',
                    summary: $localize`Error loading contacts`,
                    detail: error?.message || $localize`Could not fetch contacts`,
                    life: 5000,
                    });
            }
        } finally {
            this.loading = false;
        }
    }

    onLazyLoad(event: TableLazyLoadEvent) {
        console.log('onLazyLoad',event);
        this.page = Math.floor(event.first ?? 0 / (event.rows ?? this.DEFAULT_ROWS));
        this.rows = event.rows ?? this.DEFAULT_ROWS;
        /*if (event.sortField) {
            this.sortField = event.sortField;
            this.sortOrder = event.sortOrder;
        } */
        this.loadContacts(false);
    }

    onGlobalFilter(table: any, event: Event) {
        this.page = 0;
        this.loadContacts(false);
    }

    onStatusFilterChange(status: ContactStatus | undefined) {
        this.statusFilter = status;
        this.page = 0;
        this.loadContacts(false);
    }

    async toggleMenuFor(contact: Contact, menu: any, event: Event) {
        this.actionsMenuItems = [
            {
                label: $localize`Actions`,
                items: [
                    {
                        label: $localize`Edit`,
                        icon: 'pi pi-fw pi-pencil',
                        disabled: !this.canUpdateContact,
                        command: () => {
                            // TODO: Implement edit functionality
                        },
                    },
                    {
                        label: $localize`Remove`,
                        icon: 'pi pi-fw pi-trash',
                        disabled: !this.canDeleteContact,
                        command: () => {
                            this.confirmationService.confirm({
                                key: 'confirm-delete',
                                accept: async () => {
                                    // TODO: Implement delete functionality
                                    this.messageService.add({
                                        severity: 'success',
                                        summary: $localize`Success removing contact`,
                                        detail: $localize`Contact has been removed`,
                                        life: 5000,
                                    });
                                },
                            });
                        },
                    },
                ],
            },
        ];

        menu.toggle(event);
    }

    reset() {
        this.sortField = '';
        this.sortOrder = -1;
        this.filterValue = '';
        this.statusFilter = undefined;
        this.page = 0;
        this.loadContacts(true);
    }

    exportContactsToCSV() {
        const fileContent = CsvUtils.jsonToCsv<Contact>(
            ['email', 'firstName', 'lastName', 'status', 'createdAt', 'lists'],
            this.contacts,
            ';',
        );

        const blob = new Blob([fileContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `${this.currentOrgSlug}_contacts.csv`;
        a.click();
        window.URL.revokeObjectURL(url);
    }

    getStatusSeverity(status: ContactStatus): any {
        switch (status) {
            case ContactStatus.Active:
                return 'success';
            case ContactStatus.Unsubscribed:
                return 'primary';
            case ContactStatus.Bounced:
                return 'warning';
            case ContactStatus.Spam:
                return 'danger';
            default:
                return 'info';
        }
    }
} 