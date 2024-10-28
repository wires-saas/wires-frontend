import { Component, Input } from '@angular/core';
import { NgIf } from '@angular/common';

@Component({
    selector: 'app-wip',
    templateUrl: './wip.component.html',
    standalone: true,
    imports: [NgIf],
})
export class WipComponent {
    @Input() title: string | undefined =
        $localize`Currently under construction`;
    @Input() description: string | number | undefined =
        $localize`This feature is not yet available. Contact us for more information.`;
    @Input() icon: string | undefined = 'pi pi-hourglass'; // TODO <i class="fa-light fa-screwdriver-wrench"></i>
}
