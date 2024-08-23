import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

export interface Metric {
    title: string;
    icon: string;
    fieldColor: string;
    color: string;

    current: number;
    total: number;

    files?: string;
    fileSize?: string;
    items: object;
}

export interface File {
    name?: string;
    image?: string;
    date?: string;
    fileSize?: string;
}

export interface Folder {
    name: string;
    icon: string;
    size: string;
}

@Injectable()
export class FileAppService {

    private readonly domain: string;

    constructor(private http: HttpClient) {
        this.domain = 'assets/mocks/file-management.json'; // environment.backend;
    }

    getFiles() {
        return this.http.get<any>(this.domain)
            .toPromise()
            .then(res => res.files as File[])
            .then(data => data);
    }

    getMetrics() {
        return this.http.get<any>(this.domain)
            .toPromise()
            .then(res => res.metrics as Metric[])
            .then(data => data);
    }

    getFoldersSmall() {
        return this.http.get<any>(this.domain)
            .toPromise()
            .then(res => res.folders_small as Folder[])
            .then(data => data);
    }

    getFoldersLarge() {
        return this.http.get<any>(this.domain)
            .toPromise()
            .then(res => res.folders_large as Folder[])
            .then(data => data);
    }

}
