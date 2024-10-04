import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';
import { Block } from './block.service';


export interface Folder {
    id: string;
    organization: string;
    displayName: string;
    description: string;
    parentFolder: string | null;
}

export enum FolderItemType {
    Block = 'block',
}

@Injectable({
    providedIn: 'root',
})
export class FolderService {
    private readonly domain: string;

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    createFolder(organizationId: string, displayName: string, description: string, parentFolderId: string | null): Promise<Folder> {
        return firstValueFrom(this.http.post<Folder>(`${this.domain}/organizations/${organizationId}/folders`, {
            organization: organizationId,
            displayName: displayName,
            description: description,
            parentFolder: parentFolderId
        }));
    }

    updateFolder(organizationId: string, folderId: string, displayName: string, description: string): Promise<Folder> {
        return firstValueFrom(this.http.patch<Folder>(`${this.domain}/organizations/${organizationId}/folders/${folderId}`, {
            displayName: displayName,
            description: description
        }));
    }

    getFolders(organizationId: string): Promise<Folder[]> {
        return firstValueFrom(this.http.get<Folder[]>(`${this.domain}/organizations/${organizationId}/folders`));
    }

    getFolderContent<T>(organizationId: string, folderId: string, itemType?: FolderItemType): Promise<T[]> {

        let endpoint = `${this.domain}/organizations/${organizationId}/folders/${folderId}/items`;

        if (itemType) endpoint += `?type=${itemType}`;

        return firstValueFrom(this.http.get<T[]>(endpoint));
    }

    removeFolder(organizationId: string, folderId: string): Promise<void> {
        return firstValueFrom(this.http.delete<void>(`${this.domain}/organizations/${organizationId}/folders/${folderId}`));
    }

}
