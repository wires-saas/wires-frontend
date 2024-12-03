import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import pretty from 'pretty';
import { deepClone } from '../utils/deep-clone';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import {PaginationResult} from "../utils/pagination.utils";

export interface BlockRef
    extends Pick<Block, 'id' | 'organization' | 'version'> {}

export interface Structure {
    type: string;
    children: Array<Structure | Content<any>>;
}

export enum ContentType {
    AD = 'ad',
    BUTTON = 'button',
    IMAGE = 'image',
    TEXT = 'text',
}

export interface Content<T extends ContentType> {
    type: T;
}

export class ImageContent implements Content<ContentType.IMAGE> {
    type: ContentType.IMAGE = ContentType.IMAGE;
    src: string;

    constructor(src: string) {
        this.src = src;
    }
}

export class TextContent implements Content<ContentType.TEXT> {
    type: ContentType.TEXT = ContentType.TEXT;
    value: string;

    constructor(value: string) {
        this.value = value;
    }
}

export const isImageContent = (
    content: Content<any>,
): content is ImageContent => {
    return content.type === ContentType.IMAGE;
}

export const isTextContent = (
    content: Content<any>,
): content is TextContent => {
    return content.type === ContentType.TEXT;
}

export class Block {
    id?: string;
    organization: string;
    displayName: string;
    description: string;

    parameters: BlockParameters;

    model: Structure[];
    code: string;

    wysiwygEnabled: boolean; // if set to true, disable model to code compilation, allowing direct code modification

    isArchived: boolean;

    version: number;

    updatedAt?: Date;

    parametersList(): BlockParameter<any>[] {
        return Object.values(this.parameters);
    }

    removeParameter(key: string) {
        delete this.parameters[key];
    }

    setCode(code: string) {
        this.code = code;
    }

    setDisplayName(displayName: string) {
        this.displayName = displayName;
    }

    setDescription(description: string) {
        this.description = description;
    }

    convertToPureHTML(): void {
        this.wysiwygEnabled = false;
    }

    archive() {
        this.isArchived = true;
    }

    constructor(properties: Partial<Block>) {
        this.id = '';
        this.organization = '';
        this.displayName = '';
        this.description = '';
        this.parameters = {};
        this.model = [];
        this.code = '';
        this.wysiwygEnabled = true;
        this.isArchived = false;
        this.version = 0;

        Object.assign(this, properties);
    }
}

export class BlockWithHistory extends Block {
    $$history: Block[];
    $$index: number;

    constructor(properties: Partial<Block>, history: Block[] = [], index = 0) {
        super(properties);
        this.$$history = history;
        this.$$index = index;
        if (history.length === 0) this.saveInitialState();
    }

    clone(): BlockWithHistory {
        return new BlockWithHistory(
            deepClone(this),
            this.$$history.map((_) => deepClone(_)),
            this.$$index,
        );
    }

    override setCode(code: string) {
        super.setCode(code);
        this.save();
    }

    override setDisplayName(displayName: string) {
        super.setDisplayName(displayName);
        this.save();
    }

    override setDescription(description: string) {
        super.setDescription(description);
        this.save();
    }

    override removeParameter(key: string) {
        super.removeParameter(key);
        this.save(); // saving after as current state is always part of history
    }

    override convertToPureHTML(): void {
        super.convertToPureHTML();
        this.save();
    }

    saveInitialState() {
        this.$$history.push({
            ...deepClone(this),
            $$history: undefined,
            $$index: undefined,
        });
    }

    save() {
        // When saving, we remove all future states
        // (undo/redo doesn't make sense after a new state change + save)
        this.$$history = this.$$history.slice(0, this.$$index + 1);

        // Then we set the index to match latest state in history
        this.$$index = this.$$history.length;
        this.version = this.$$index;

        // Finally pushing the new state
        this.$$history.push({
            ...deepClone(this),
            $$history: undefined,
            $$index: undefined,
        });
    }

    undo() {
        if (this.$$index > 0) {
            this.$$index--;

            // Current state is saved in history for redo
            if (!this.$$history.find((_) => _.version === this.version)) {
                this.$$history.push({
                    ...deepClone(this),
                    $$history: undefined,
                    $$index: undefined,
                });
            }

            Object.assign(this, deepClone(this.$$history[this.$$index]), {
                $$history: this.$$history,
                $$index: this.$$index,
            });
        }
    }

    redo() {
        if (this.$$index < this.$$history.length - 1) {
            this.$$index++;

            const stateToRedo = deepClone(this.$$history[this.$$index]);

            Object.assign(this, stateToRedo, {
                $$history: this.$$history, // .filter(_ => _.version !== stateToRedo.version),
                $$index: this.$$index,
            });
        }
    }

    canUndo(): boolean {
        return this.$$index > 0;
    }

    canRedo(): boolean {
        return !!(
            this.$$history &&
            this.$$history.length &&
            this.$$index < this.$$history.length - 1
        );
    }
}

export enum ParameterType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    DATE = 'date',
    LINK = 'link',
    STRING_ARRAY = 'string_array',
}

export enum ParameterSource {
    CONSTANT = 'constant', // value is hardcoded
    USER_DEFINED = 'user_defined', // user input
    HTTP_REQUEST = 'http_request', // result of a request
    AI_REQUEST = 'ai_request', // result of a prompt
    CONTACT_METADATA = 'contact_metadata', // first name, last name, etc.
    SYSTEM = 'system', // date, hours, etc.
    ARTICLE = 'article', // article content
}

export interface BlockParameter<T extends ParameterType> {
    type: T;
    key: string;
    displayName: string;
    description: string;
    required: boolean;
    source: ParameterSource;
}

export interface BlockParameters {
    [key: string]: BlockParameter<any>;
}

@Injectable()
export class BlockService {
    private domain: string;

    private timeout: number = 0;

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async getBlocks(organizationId: string): Promise<Block[]> {
        return new Promise((res, _) => {
            setTimeout(async () => {
                res(
                    firstValueFrom(
                        this.http.get<PaginationResult<Block>>(
                            `${this.domain}/organizations/${organizationId}/blocks`,
                        ),
                    ).then((result) => result.items),
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
