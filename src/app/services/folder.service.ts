import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { firstValueFrom } from 'rxjs';

export enum FolderContentType {
    Block = 'block',
    Template = 'template',
}


// Folder is generic over the type of content it contains
export interface Folder {
    label: string;
    id: string;
    contentType: FolderContentType;
    parentId?: string;
}



@Injectable({
    providedIn: 'root',
})
export class FolderService {
    private readonly domain: string;

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    getFolders(): Promise<Folder[]> {

        return new Promise((res, _) => res([
            {
                label: 'Headers',
                id: '1',
                contentType: FolderContentType.Block,
            },
            {
                label: 'Contents',
                id: '2',
                contentType: FolderContentType.Block,
            },
            {
                label: 'Footers',
                id: '3',
                contentType: FolderContentType.Block,
            },
        ]));


        // return firstValueFrom(this.http.get<Folder<any>[]>(`${this.domain}/folders`));
    }




}
