import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, firstValueFrom, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

export interface Tag {
    _id?: string;

    organization: string;

    displayName: string;
    description: string;

    ruleset: TagRule[];
}

export interface TagRule {
    field: string;
    operator: string;
    filters: Array<{ filterValue: any; filterType: string; }>;
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
