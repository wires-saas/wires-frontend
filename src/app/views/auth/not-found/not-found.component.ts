import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    templateUrl: './not-found.component.html',
})
export class NotFoundComponent implements OnInit {
    data: {
        title?: string;
        message?: string;
        button?: string;
    } = {};

    constructor(private activatedRoute: ActivatedRoute) {}

    async ngOnInit() {
        this.data = this.activatedRoute.snapshot.data;
    }
}
