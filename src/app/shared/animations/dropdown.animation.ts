import { animate, style, transition, trigger } from "@angular/animations";

export const dropdownAnimation = trigger('dropdown', [
    transition(':enter', [
        style({ opacity: 0, transform: 'translateY(10px)' }),
        animate('200ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
    ]),
    transition(':leave', [
        animate('150ms ease-in', style({ opacity: 0, transform: 'translateY(10px)' }))
    ])
]);