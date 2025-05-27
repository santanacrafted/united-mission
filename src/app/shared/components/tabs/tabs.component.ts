import { CommonModule } from '@angular/common';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  ElementRef,
  ViewChild,
  AfterViewInit,
} from '@angular/core';

@Component({
  selector: 'app-tabs',
  templateUrl: './tabs.component.html',
  styleUrls: ['./tabs.component.scss'],
  standalone: true,
  imports: [CommonModule],
})
export class TabsComponent implements AfterViewInit {
  @Input() tabs: { id: string; label: string }[] = [];
  @Input() activeTab: string = '';
  @Output() tabChange = new EventEmitter<string>();

  @ViewChild('tabContainer') tabContainer!: ElementRef;

  underlineLeft: number = 0;
  underlineWidth: number = 0;

  ngAfterViewInit(): void {
    setTimeout(() => this.updateUnderline());
  }

  onTabClick(tabId: string, event?: MouseEvent) {
    this.activeTab = tabId;
    this.tabChange.emit(tabId);
    this.updateUnderline(event);
  }

  updateUnderline(event?: MouseEvent) {
    let buttonEl: HTMLElement | null = null;

    if (event) {
      buttonEl = event.target as HTMLElement;
    } else {
      buttonEl = this.tabContainer?.nativeElement.querySelector(
        `button[data-id="${this.activeTab}"]`
      );
    }

    if (buttonEl) {
      this.underlineLeft = buttonEl.offsetLeft;
      this.underlineWidth = buttonEl.offsetWidth;
    }
  }

  onSelectChange(event: Event) {
    const select = event.target as HTMLSelectElement;
    this.onTabClick(select.value);
  }
}
