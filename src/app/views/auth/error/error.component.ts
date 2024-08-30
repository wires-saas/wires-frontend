import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './error.component.html',
})
export class ErrorComponent implements OnInit {
    data: {
        title?: string;
        message?: string;
        button?: string;
    } = {};
    constructor(private activatedRoute: ActivatedRoute) {}

    ngOnInit() {
        this.data = this.activatedRoute.snapshot.data;
    }
}
