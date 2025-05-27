import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';

interface DropdownItem {
  label: string;
  value: any;
  icon?: string;
}

@Component({
  selector: 'app-dropdown',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="relative inline-block w-64">
      <button
        (click)="toggleDropdown()"
        class="w-full bg-white border border-gray-300 rounded px-4 py-2 text-left shadow-sm flex items-center justify-between"
      >
        <span class="flex items-center gap-2">
          <i *ngIf="selected?.icon" class="material-icons text-gray-500">{{
            selected?.icon
          }}</i>
          {{ selected?.label || placeholder }}
        </span>
        <i class="material-icons text-gray-400">arrow_drop_down</i>
      </button>

      <div
        *ngIf="isOpen"
        class="absolute z-50 mt-1 w-full bg-white border border-gray-200 rounded shadow-lg max-h-60 overflow-auto"
      >
        <ul>
          <li
            *ngFor="let item of items"
            (click)="selectItem(item)"
            class="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center gap-2"
          >
            <i *ngIf="item.icon" class="material-icons text-gray-500">{{
              item.icon
            }}</i>
            {{ item.label }}
          </li>
        </ul>
      </div>
    </div>
  `,
})
export class DropdownComponent {
  @Input() items: DropdownItem[] = [];
  @Input() placeholder: string = 'Select...';
  @Output() selectionChange = new EventEmitter<any>();

  isOpen = false;
  selected: DropdownItem | null = null;

  toggleDropdown(): void {
    this.isOpen = !this.isOpen;
  }

  selectItem(item: DropdownItem): void {
    this.selected = item;
    this.isOpen = false;
    this.selectionChange.emit(item);
  }

  @HostListener('document:click', ['$event'])
  handleClickOutside(event: MouseEvent): void {
    const target = event.target as HTMLElement;
    if (!target.closest('app-dropdown')) {
      this.isOpen = false;
    }
  }
}
