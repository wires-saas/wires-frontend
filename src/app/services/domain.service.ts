import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { Domain, EmailsProvider } from './emails.service';
import { HttpClient } from '@angular/common/http';


export enum DomainStatus {
    Verified = 'verified',
    Pending = 'pending',
}

@Injectable()
export class DomainService {
    private readonly domain: string;

    private selectedDomain$$: Subject<Domain> =
        new Subject<Domain>();
    selectedDomain$: Observable<Domain> =
        this.selectedDomain$$.asObservable();

    createDialogVisible: boolean = false;
    private createDialogVisible$$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(this.createDialogVisible);
    createDialogVisible$: Observable<boolean> =
        this.createDialogVisible$$.asObservable();

    inspectDialogVisible: boolean = false;
    private inspectDialogVisible$$: BehaviorSubject<boolean> =
        new BehaviorSubject<boolean>(this.inspectDialogVisible);
    inspectDialogVisible$: Observable<boolean> =
        this.inspectDialogVisible$$.asObservable();

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async createDomain(
        organizationId: string,
        providerId: string,
        domain: string,
    ): Promise<EmailsProvider> {
        return firstValueFrom(
            this.http.post<EmailsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${providerId}/domains`,
                { domain },
            ),
        );
    }

    async checkDomain(
        organizationId: string,
        providerId: string,
        domain: Domain,
    ): Promise<boolean> {
        return firstValueFrom(
            this.http.post<boolean>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${providerId}/domains/${domain.domain}/dns`,
                domain,
            ),
        );
    }

    async removeDomain(
        organizationId: string,
        providerId: string,
        domain: Domain,
    ): Promise<EmailsProvider> {
        return firstValueFrom(
            this.http.delete<EmailsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${providerId}/domains/${domain.domain}`,
            ),
        );
    }

    // UI

    selectDomain(domain: Domain) {
        this.selectedDomain$$.next(domain);
    }

    showCreateDialog() {
        this.createDialogVisible = true;
        this.createDialogVisible$$.next(true);
    }

    closeCreateDialog() {
        this.createDialogVisible = false;
        this.createDialogVisible$$.next(false);
    }

    showInspectDialog() {
        this.inspectDialogVisible = true;
        this.inspectDialogVisible$$.next(true);
    }

    closeInspectDialog() {
        this.inspectDialogVisible = false;
        this.inspectDialogVisible$$.next(false);
    }

}
