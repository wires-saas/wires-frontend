import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { DialogConfig } from './feed.service';
import { BehaviorSubject, firstValueFrom, Observable, Subject } from 'rxjs';
import { Domain, EmailsProvider } from './emails.service';
import { HttpClient } from '@angular/common/http';


@Injectable()
export class DomainService {
    private readonly domain: string;

    private selectedDomain$$: Subject<Domain> =
        new Subject<Domain>();
    selectedDomain$: Observable<Domain> =
        this.selectedDomain$$.asObservable();

    dialogConfig: DialogConfig = {
        visible: false,
        header: '',
        isNew: false,
    };

    private dialogSource$$: BehaviorSubject<DialogConfig> =
        new BehaviorSubject<DialogConfig>(this.dialogConfig);
    dialogSource$: Observable<DialogConfig> =
        this.dialogSource$$.asObservable();

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async createDomain(
        organizationId: string,
        providerId: string,
        domain: Domain,
    ): Promise<EmailsProvider> {
        return firstValueFrom(
            this.http.post<EmailsProvider>(
                `${this.domain}/organizations/${organizationId}/providers/emails/${providerId}/domains`,
                domain,
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

    showDialog(header: string, newDomain: boolean) {
        this.dialogConfig = {
            visible: true,
            header: header,
            isNew: newDomain,
        };

        this.dialogSource$$.next(this.dialogConfig);
    }

    closeDialog() {
        this.dialogConfig = { visible: false };
        this.dialogSource$$.next(this.dialogConfig);
    }

}
