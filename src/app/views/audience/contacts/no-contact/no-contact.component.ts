import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
    selector: 'app-no-contact',
    templateUrl: './no-contact.component.html',
})
export class NoContactComponent {
    constructor(private router: Router) {}

    navigateToUpload(): void {
        this.router.navigate(['/audience/contacts/upload']);
    }
} 