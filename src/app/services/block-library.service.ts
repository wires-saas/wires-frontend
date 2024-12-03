import {Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../environments/environment";
import {firstValueFrom} from "rxjs";
import pretty from "pretty";
import {Block, ParameterSource, ParameterType} from "./block.service";
import {PaginationResult} from "../utils/pagination.utils";

@Injectable()
export class BlockLibraryService {
    private domain: string;

    private timeout: number = 0;

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async getBlocks(organizationId: string, page: number, limit: number, searchFilter: string): Promise<PaginationResult<Block>> {

        const params: any = { page, limit };
        if (searchFilter) params.searchFilter = searchFilter;

        return new Promise((res, _) => {
            setTimeout(async () => {
                res(
                    firstValueFrom(
                        this.http.get<PaginationResult<Block>>(
                            `${this.domain}/organizations/${organizationId}/blocks`,
                            { params },
                        ),
                    ),
                );
            }, this.timeout);
        });
    }

    async getBlock(organizationId: string, blockId: string): Promise<Block> {
        return new Promise((res, _) => {
            setTimeout(async () => {
                res(
                    firstValueFrom(
                        this.http.get<Block>(
                            `${this.domain}/organizations/${organizationId}/blocks/${blockId}`,
                        ),
                    ),
                );
            }, this.timeout);
        });
    }

    getNewBlock(organizationId: string, wysiwygEnabled: boolean): Block {
        const formattedCode = pretty(
            '<div><h1>{{ #leftArticle.title }}</h1></div>',
        );

        return new Block({
            organization: organizationId,
            displayName: $localize`New Block`,
            description: $localize`Empty description`,
            wysiwygEnabled: wysiwygEnabled,
            parameters: {
                test: {
                    key: 'test',
                    type: ParameterType.STRING,
                    displayName: 'test',
                    description: 'test',
                    required: true,
                    source: ParameterSource.CONSTANT,
                },
                leftArticle: {
                    key: 'articleTitle',
                    type: ParameterType.STRING,
                    displayName: 'Titre Article',
                    description: 'Titre article pour le bloc de gauche',
                    required: true,
                    source: ParameterSource.ARTICLE,
                },
            },
            code: formattedCode,
            version: 0,
        });
    }

    async createBlock(organizationId: string, block: Block): Promise<Block> {
        return firstValueFrom(
            this.http.post<Block>(
                `${this.domain}/organizations/${organizationId}/blocks`,
                {
                    organization: organizationId,
                    displayName: block.displayName,
                    description: block.description,

                    parameters: Object.values(block.parameters),

                    model: block.model,
                    code: block.code,

                    wysiwygEnabled: block.wysiwygEnabled,
                    isArchived: block.isArchived,
                },
            ),
        );
    }

    async updateBlock(organizationId: string, block: Block): Promise<Block> {
        return firstValueFrom(
            this.http.put<Block>(
                `${this.domain}/organizations/${organizationId}/blocks/${block.id}`,
                {
                    id: block.id,
                    organization: organizationId,
                    displayName: block.displayName,
                    description: block.description,

                    parameters: Object.values(block.parameters),

                    model: block.model,
                    code: block.code,

                    wysiwygEnabled: block.wysiwygEnabled,
                    isArchived: block.isArchived,
                },
            ),
        );
    }

    async deleteBlock(organizationId: string, blockId: string): Promise<void> {
        return new Promise((res, _) => {
            setTimeout(async () => {
                res(
                    firstValueFrom(
                        this.http.delete<void>(
                            `${this.domain}/organizations/${organizationId}/blocks/${blockId}`,
                        ),
                    ),
                );
            }, this.timeout);
        });
    }

    async archiveBlock(organizationId: string, blockId: string): Promise<void> {
        return firstValueFrom(
            this.http.patch<void>(
                `${this.domain}/organizations/${organizationId}/blocks/${blockId}`,
                { isArchived: true },
            ),
        );
    }
}
