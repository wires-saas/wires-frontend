import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import {AbstractControl, AsyncValidator, FormControl} from '@angular/forms';
import {map, catchError, switchMap} from 'rxjs/operators';
import { of } from 'rxjs';
import {environment} from "../../../environments/environment";

// https://stackoverflow.com/questions/64045241/in-angular-how-to-create-a-custom-validator-that-validates-a-http-request

@Injectable({
    providedIn: 'root',
})
export class SlugAvailableValidator implements AsyncValidator {
    private readonly domain: string;

    constructor(private http: HttpClient) {
        this.domain = environment.backend;
    }

    validate = (control: AbstractControl) => {
        const slug = control.value;
        return this.http
            .get<void>(`${this.domain}/slugs/${slug}`)
            .pipe(
                //   errors skip the map(). if we return null, means we got 200 response code
                switchMap(() => {
                    return of({ slugUnavailable: true });
                }),
                catchError((err) => {
                    //check the err obj to see its properties
                    console.error(err);
                    // Expecting a 404 error
                    return of(null);
                })
            );
    };
}
