import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tag {
    _id?: string; // do not generate

    organization: string; // do not generate

    color: string; // do not generate

    displayName: string;
    description: string;

    ruleset: TagRule[];
}

export enum FilterType {
    equals = 'equals',
    notEquals = 'notEquals',
    contains = 'contains',
    notContains = 'notContains',
    startsWith = 'startsWith',
    endsWith = 'endsWith',
    dateIs = 'dateIs', // timestamp
    dateIsNot = 'dateIsNot', // timestamp
    dateBefore = 'dateBefore', // timestamp
    dateAfter = 'dateAfter', // timestamp
    greaterThan = 'gt',
    lessThan = 'lt',
    greaterThanOrEqual = 'gte',
    lessThanOrEqual = 'lte',
    in = 'in',
    notIn = 'nin',
}

export interface TagRule {
    field: string;
    operator: 'or' | 'and';
    filters: Array<{ filterValue: any; filterType: FilterType; }>;
}

@Injectable()
export class TagService {
    private domain: string;

    private tags$$: BehaviorSubject<Tag[]> = new BehaviorSubject<Tag[]>([]);

    public tags$: Observable<Tag[]> = this.tags$$.asObservable();

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async getTags(organizationId: string): Promise<Tag[]> {
        return firstValueFrom(
            this.http.get<Tag[]>(
                `${this.domain}/organizations/${organizationId}/tags`,
            ),
        ).then((tags) => {
            this.tags$$.next(tags);
            return tags;
        });
    }

    async getTag(organizationId: string, tagId: string): Promise<Tag> {
        return firstValueFrom(
            this.http.get<Tag>(
                `${this.domain}/organizations/${organizationId}/tags/${tagId}`,
            ),
        );
    }

    async putTag(
        organizationId: string,
        tag: Tag,
    ): Promise<Tag> {

        return firstValueFrom(
            this.http.put<Tag>(
                `${this.domain}/organizations/${organizationId}/tags`,
                tag,
            ),
        ).then((responseTag) => {
            const tags = this.tags$$.getValue();
            this.tags$$.next([...tags, responseTag]);
            return responseTag;
        });
    }

    async deleteTag(organizationId: string, tagId: string): Promise<void> {
        return firstValueFrom(
            this.http.delete<Tag>(
                `${this.domain}/organizations/${organizationId}/tags/${tagId}`,
            ),
        ).then(() => {
            const tags: Tag[] = this.tags$$
                .getValue()
                .filter((tag) => tag._id !== tagId);
            this.tags$$.next(tags);
        });
    }
}
