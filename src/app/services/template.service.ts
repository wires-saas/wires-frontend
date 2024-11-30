import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { deepClone } from '../utils/deep-clone';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';

export class Template {
    id?: string;
    organization: string;
    displayName: string;
    description: string;

    model: any[];

    isArchived: boolean;

    version: number;

    updatedAt?: Date;

    setDisplayName(displayName: string) {
        this.displayName = displayName;
    }

    setDescription(description: string) {
        this.description = description;
    }

    archive() {
        this.isArchived = true;
    }

    constructor(properties: Partial<Template>) {
        this.id = '';
        this.organization = '';
        this.displayName = '';
        this.description = '';
        this.model = [];
        this.isArchived = false;
        this.version = 0;

        Object.assign(this, properties);
    }
}

export class TemplateWithHistory extends Template {
    $$history: Template[];
    $$index: number;

    constructor(properties: Partial<Template>, history: Template[] = [], index = 0) {
        super(properties);
        this.$$history = history;
        this.$$index = index;
        if (history.length === 0) this.saveInitialState();
    }

    clone(): TemplateWithHistory {
        return new TemplateWithHistory(
            deepClone(this),
            this.$$history.map((_) => deepClone(_)),
            this.$$index,
        );
    }

    override setDisplayName(displayName: string) {
        super.setDisplayName(displayName);
        this.save();
    }

    override setDescription(description: string) {
        super.setDescription(description);
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

@Injectable()
export class TemplateService {
    private domain: string;

    private timeout: number = 0;

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    async getTemplates(organizationId: string): Promise<Template[]> {
        return new Promise((res, _) => {
            setTimeout(async () => {
                res(
                    firstValueFrom(
                        this.http.get<Template[]>(
                            `${this.domain}/organizations/${organizationId}/templates`,
                        ),
                    ),
                );
            }, this.timeout);
        });
    }

    async getTemplate(organizationId: string, templateId: string): Promise<Template> {
        return new Promise((res, _) => {
            setTimeout(async () => {
                res(
                    firstValueFrom(
                        this.http.get<Template>(
                            `${this.domain}/organizations/${organizationId}/templates/${templateId}`,
                        ),
                    ),
                );
            }, this.timeout);
        });
    }

    getNewTemplate(organizationId: string): Template {
        return new Template({
            organization: organizationId,
            displayName: $localize`New Template`,
            description: $localize`Empty description`,
            model: [],
            version: 0,
        });
    }

    async createTemplate(organizationId: string, template: Template): Promise<Template> {
        return firstValueFrom(
            this.http.post<Template>(
                `${this.domain}/organizations/${organizationId}/templates`,
                {
                    organization: organizationId,
                    displayName: template.displayName,
                    description: template.description,

                    model: template.model,

                    isArchived: template.isArchived,
                },
            ),
        );
    }

    async updateTemplate(organizationId: string, template: Template): Promise<Template> {
        return firstValueFrom(
            this.http.put<Template>(
                `${this.domain}/organizations/${organizationId}/templates/${template.id}`,
                {
                    id: template.id,
                    organization: organizationId,
                    displayName: template.displayName,
                    description: template.description,

                    model: template.model,

                    isArchived: template.isArchived,
                },
            ),
        );
    }

    async deleteTemplate(organizationId: string, templateId: string): Promise<void> {
        return new Promise((res, _) => {
            setTimeout(async () => {
                res(
                    firstValueFrom(
                        this.http.delete<void>(
                            `${this.domain}/organizations/${organizationId}/templates/${templateId}`,
                        ),
                    ),
                );
            }, this.timeout);
        });
    }

    async archiveTemplate(organizationId: string, templateId: string): Promise<void> {
        return firstValueFrom(
            this.http.patch<void>(
                `${this.domain}/organizations/${organizationId}/templates/${templateId}`,
                { isArchived: true },
            ),
        );
    }
}
