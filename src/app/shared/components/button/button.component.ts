import {
  Component,
  EventEmitter,
  Input,
  OnDestroy,
  Output,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-button',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <button
      *ngIf="type === 'button'"
      (click)="onClick()"
      [ngClass]="[buttonClasses, defaultClasses]"
      [style.backgroundColor]="backgroundColor"
      [style.color]="textColor"
      [style.borderRadius]="borderRadius"
      [disabled]="disabled || isLoading"
      [style.padding]="padding"
      class="transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer relative"
    >
      <div
        *ngIf="isLoading"
        class="absolute inset-0 flex items-center justify-center"
      >
        <span
          class="spinner border-t-2 border-white border-solid rounded-full w-5 h-5 animate-spin"
        ></span>
      </div>
      <span [class.invisible]="isLoading" class="flex items-center">
        <ng-container *ngIf="icon && iconPosition === 'left'">
          <i class="material-icons mr-2">{{ icon }}</i>
        </ng-container>
        {{ label }}
        <ng-container *ngIf="icon && iconPosition === 'right'">
          <i class="material-icons ml-2">{{ icon }}</i>
        </ng-container>
      </span>
    </button>

    <a
      *ngIf="type === 'link'"
      (click)="onClick()"
      [ngClass]="[buttonClasses, defaultClasses]"
      [style.backgroundColor]="backgroundColor"
      [style.color]="textColor"
      [style.borderRadius]="borderRadius"
      [style.padding]="padding"
      [routerLink]="path"
      class="transition duration-200 ease-in-out transform hover:scale-105 cursor-pointer relative"
    >
      <div
        *ngIf="isLoading"
        class="absolute inset-0 flex items-center justify-center"
      >
        <span
          class="spinner border-t-2 border-white border-solid rounded-full w-5 h-5 animate-spin"
        ></span>
      </div>
      <span [class.invisible]="isLoading" class="flex items-center">
        <ng-container *ngIf="icon && iconPosition === 'left'">
          <i class="material-icons mr-2">{{ icon }}</i>
        </ng-container>
        {{ label }}
        <ng-container *ngIf="icon && iconPosition === 'right'">
          <i class="material-icons ml-2">{{ icon }}</i>
        </ng-container>
      </span>
    </a>
  `,
})
export class ButtonComponent implements OnDestroy {
  @Input() label: string = 'Button';
  @Input() path?: string;
  @Input() type: 'button' | 'link' = 'button';
  @Input() backgroundColor: string = '#3B82F6';
  @Input() textColor: string = '#ffffff';
  @Input() borderRadius: string = '0.5rem';
  @Input() icon?: string;
  @Input() iconPosition: 'left' | 'right' = 'right';
  @Input() disabled: boolean = false;
  @Input() padding: string = '0.5rem 1rem';
  @Input() shadow: boolean = true;
  @Input() outline: boolean = false;
  @Input() defaultClasses?: string;
  @Input() isLoading: boolean = false;
  @Output() buttonClick = new EventEmitter<any>();

  get buttonClasses() {
    return [
      'flex',
      'items-center',
      'justify-center',
      this.shadow ? 'shadow-md' : '',
      this.outline ? 'border-2 border-current bg-transparent' : '',
    ].join(' ');
  }

  ngOnDestroy(): void {
    this.isLoading = false;
  }

  onClick() {
    if (!this.disabled && !this.isLoading) {
      this.buttonClick.emit({});
    }
  }
}
