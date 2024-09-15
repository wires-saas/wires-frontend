import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import pretty from 'pretty';
import { deepClone } from '../utils/deep-clone';

export interface BlockRef extends Pick<Block, '_id' | 'organization' | 'version'> {}

export class Block {

    _id?: string;
    organization: string;
    displayName: string;
    description: string;

    parameters: BlockParameters;

    model: BlockRef[];
    code: string;

    wysiwygEnabled: boolean; // if set to true, disable model to code compilation, allowing direct code modification

    version: number;

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

    constructor(properties: Partial<Block>) {
        this._id = '';
        this.organization = '';
        this.displayName = '';
        this.description = '';
        this.parameters = {};
        this.model = [];
        this.code = '';
        this.wysiwygEnabled = true;
        this.version = 0;

        Object.assign(this, properties);
    }
}

export class BlockWithHistory extends Block {
    $$history: Block[] = [];
    $$index = 0;

    constructor(properties: Partial<Block>) {
        super(properties);
        this.saveInitialState();
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
        console.log('convertToPureHTML', this);
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
            if (!this.$$history.find(_ => _.version === this.version)) {
                this.$$history.push({
                    ...deepClone(this),
                    $$history: undefined,
                    $$index: undefined,
                });
            }

            Object.assign(
                this,
                deepClone(this.$$history[this.$$index]),
                {
                    $$history: this.$$history,
                    $$index: this.$$index,
                }
            );
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
        return !!(this.$$history && this.$$history.length && this.$$index < this.$$history.length - 1);
    }
}

export enum ParameterType {
    STRING = 'string',
    NUMBER = 'number',
    BOOLEAN = 'boolean',
    DATE = 'date',
    ENUM = 'enum',
    ARTICLE = 'article',
    CONTENT = 'content',
    OBJECT = 'object',
    ARRAY = 'array',
}

export interface BlockParameter<T extends ParameterType> {
    type: T;
    key: string;
    displayName: string;
    description: string;
    required: boolean;
}

export interface BlockParameters {
    [key: string]: any;
}



@Injectable()
export class BlockService {
    private domain: string;

    private block!: Block;

    constructor() {
        this.domain = environment.backend;
    }

    getNewBlock(wysiwygEnabled: boolean): Block {

        const formattedCode = pretty('<div><h1>{{ #leftArticle.title }}</h1></div>');

        return new Block({
            _id: '1',
            organization: '1',
            displayName: $localize `New Block`,
            description: $localize `Edit description here`,
            wysiwygEnabled: wysiwygEnabled,
            parameters: {
                'test': {
                    key: 'test',
                    type: ParameterType.STRING,
                    displayName: 'test',
                    description: 'test',
                    required: true,
                },
                'leftArticle': {
                    key: 'leftArticle',
                    type: ParameterType.ARTICLE,
                    displayName: 'Bloc Article (gauche)',
                    description: 'Article pour le bloc de gauche',
                    required: true,
                },
            },
            code: formattedCode,
            version: 0
        });
    }

}
