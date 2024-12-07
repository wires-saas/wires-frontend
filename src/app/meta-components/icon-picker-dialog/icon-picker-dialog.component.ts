import {Component, EventEmitter, Input, Output} from '@angular/core';
import { NgForOf } from '@angular/common';
import {ButtonDirective} from "primeng/button";
import {DialogModule} from "primeng/dialog";
import {LogosModule} from "../logos/logos.module";


@Component({
    selector: 'app-icon-picker-dialog',
    templateUrl: './icon-picker-dialog.component.html',
    standalone: true,
    imports: [
        ButtonDirective,
        DialogModule,
        LogosModule,
        NgForOf
    ],
})
export class IconPickerDialogComponent {
    @Input() visible: boolean = false;
    @Input() selectedIcon: string = '';
    @Output() onIconSelect: EventEmitter<string> = new EventEmitter<string>();
    @Output() onHide: EventEmitter<void> = new EventEmitter<void>();

    icons: string[] = [
        'fa-regular fa-user',
        'fa-regular fa-user-slash',
        'fa-regular fa-user-lock',
        'fa-regular fa-user-clock',
        'fa-regular fa-user-check',
        'fa-regular fa-user-crown',
        'fa-regular fa-user-plus',
        'fa-regular fa-user-minus',
        'fa-regular fa-user-group',
        'fa-regular fa-user-group-crown',
        'fa-regular fa-address-book',
        'fa-regular fa-cart-shopping',
        'fa-regular fa-credit-card',
        'fa-regular fa-pen-nib',
        'fa-regular fa-pen-swirl',
        'fa-regular fa-envelope',
        'fa-regular fa-scroll',
        'fa-regular fa-scroll-old',
        'fa-regular fa-paper-plane',
        'fa-regular fa-share-nodes',
        'fa-regular fa-hourglass',
        'fa-regular fa-hourglass-clock',
        'fa-regular fa-hourglass-end',
        'fa-regular fa-alarm-exclamation',
        'fa-regular fa-sun',
        'fa-regular fa-sunset',
        'fa-regular fa-sunrise',
        'fa-regular fa-sun-cloud',
        'fa-regular fa-moon',
        'fa-regular fa-earth-europe',
        'fa-regular fa-music',
        'fa-regular fa-seedling',
        'fa-regular fa-hand-holding-seedling',
        'fa-regular fa-shirt',
        'fa-regular fa-graduation-cap',
        'fa-regular fa-balloons',
        'fa-regular fa-cake-candles',
        'fa-regular fa-trash',
        'fa-regular fa-phone',
        'fa-regular fa-paperclip',
        'fa-regular fa-comment',
        'fa-regular fa-cloud',
        'fa-regular fa-calendar-days',
        'fa-regular fa-list',
        'fa-regular fa-sparkles',
        'fa-regular fa-share-from-square',
        'fa-regular fa-heart',
        'fa-regular fa-bullhorn',
        'fa-regular fa-box-ballot',
        'fa-regular fa-star',
        'fa-regular fa-trophy',
        'fa-regular fa-bird',
        'fa-regular fa-dog',
        'fa-regular fa-cat',
        'fa-regular fa-fish',
        'fa-regular fa-medal',
        'fa-regular fa-futbol',
        'fa-regular fa-football',
        'fa-regular fa-table-tennis-paddle-ball',
        'fa-regular fa-tennis-ball',
        'fa-regular fa-bowling-ball',
    ];
}
