import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CalendarEvent } from './calendar-event.model';
import { PopupService } from '../../services/popup/popup.service';
import { PopupTemplateRegistryService } from '../../services/popup-template-registry.service';

@Component({
  selector: 'app-modern-calendar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modern-calendar.component.html',
  styleUrls: ['./modern-calendar.component.scss'],
})
export class ModernCalendarComponent {
  @Input() events: CalendarEvent[] = [];
  @Output() newEvent = new EventEmitter<CalendarEvent>();
  newEventObj = {
    title: '',
    description: '',
    location: '',
    file: null,
    category: '',
    duration: 60,
    date: new Date(), // e.g., '2025-05-07'
    startTime: '', // e.g., '14:30'
    endTime: '',
  };
  currentMonth = new Date();
  selectedDate?: Date;
  viewMode: 'month' | 'day' = 'month';
  showPopup = false;
  showEventPopup = false;
  popupTime: string | null = null;
  selectedEvent?: CalendarEvent;

  hours = Array.from({ length: 24 }, (_, i) => {
    const hour = i % 12 === 0 ? 12 : i % 12;
    const period = i < 12 ? 'AM' : 'PM';
    return `${hour.toString().padStart(2, '0')}:00 ${period}`;
  });

  constructor(
    private popup: PopupService,
    private registry: PopupTemplateRegistryService
  ) {}

  get calendarDays(): { date: Date; isCurrentMonth: boolean }[] {
    const days: { date: Date; isCurrentMonth: boolean }[] = [];
    const year = this.currentMonth.getFullYear();
    const month = this.currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const startOffset = firstDay.getDay();
    const prevMonth = new Date(year, month, 0);
    const prevMonthDays = prevMonth.getDate();

    for (let i = 0; i < startOffset; i++) {
      days.push({
        date: new Date(year, month - 1, prevMonthDays - startOffset + i + 1),
        isCurrentMonth: false,
      });
    }

    for (let i = 1; i <= lastDay.getDate(); i++) {
      days.push({ date: new Date(year, month, i), isCurrentMonth: true });
    }

    let nextDay = 1;
    while (days.length % 7 !== 0) {
      days.push({
        date: new Date(year, month + 1, nextDay++),
        isCurrentMonth: false,
      });
    }

    return days;
  }

  hasEventDate(date: Date): boolean {
    const iso = date.toISOString().split('T')[0];
    return this.events.some((e) => e.date === iso);
  }

  getEventCategories(date: Date): string[] {
    const iso = date.toISOString().split('T')[0];
    const categories = this.events
      .filter((e) => e.date === iso && e.category)
      .map((e) => e.category!)
      .filter((value, index, self) => self.indexOf(value) === index); // unique values
    return categories;
  }

  eventsForHour(hour: string): CalendarEvent[] {
    if (!this.selectedDate) return [];
    const isoDate = this.selectedDate.toISOString().split('T')[0];

    const [h, period] = hour.split(' ');
    let [hr, min] = h.split(':').map(Number);
    if (period === 'PM' && hr !== 12) hr += 12;
    if (period === 'AM' && hr === 12) hr = 0;
    const slotStart = hr * 60 + min;

    return this.events.filter((e) => {
      if (e.date !== isoDate || !e.time) return false;

      const [eh, em] = e.time.split(':').map(Number);
      const eventStart = eh * 60 + em;
      const eventEnd = eventStart + (e.durationMinutes ?? 30);

      return slotStart >= eventStart && slotStart < eventEnd;
    });
  }

  convertHourToTime(hour: string): string {
    const [h, period] = hour.split(' ');
    let hourNum = parseInt(h.split(':')[0], 10);
    if (period === 'PM' && hourNum !== 12) hourNum += 12;
    if (period === 'AM' && hourNum === 12) hourNum = 0;
    return `${hourNum.toString().padStart(2, '0')}:00`;
  }

  selectDate(date: Date) {
    this.selectedDate = date;
    this.viewMode = 'day';
  }

  openEventPopup(event: CalendarEvent, clickEvent: MouseEvent) {
    clickEvent.stopPropagation();
    this.selectedEvent = event;
    this.showEventPopup = true;
  }

  addEvent() {
    if (!this.selectedDate || !this.popupTime) return;
    const event: CalendarEvent = {
      id: Date.now().toString(),
      category: this.newEventObj.category,
      title: this.newEventObj.title,
      date: this.selectedDate.toISOString().split('T')[0],
      time: this.popupTime,
      file: this.newEventObj.file,
      durationMinutes: this.newEventObj.duration,
    };
    this.newEvent.emit(event);
    this.events.push(event);
    this.showPopup = false;
    this.popupTime = null;
  }

  openAddEventDialog(hour: string) {
    this.popupTime = this.convertHourToTime(hour);
    console.log(this.popupTime);
    console.log(this.selectedDate);
    // this.newEventObj = {
    //   ...this.newEventObj,
    //   date: this.selectedDate?.toDateString(),
    // };
    const template = this.registry.getTemplate('addEventTemplate');
    if (template) {
      this.popup.open(template, {
        newEvent: this.newEventObj,
        close: (confirmed: boolean) => {
          this.popup.close();
        },
        saveEvent: (event: any) => {
          this.newEventObj = event;
          this.addEvent();
          this.popup.close();
        },
      });
    } else {
      console.error('Template not found.');
    }
  }

  backToMonth() {
    this.viewMode = 'month';
    this.selectedDate = undefined;
  }

  nextMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() + 1,
      1
    );
  }

  prevMonth() {
    this.currentMonth = new Date(
      this.currentMonth.getFullYear(),
      this.currentMonth.getMonth() - 1,
      1
    );
  }

  isStartOfEvent(event: CalendarEvent, hour: string): boolean {
    if (!event.time) return false;
    return event.time === this.convertHourToTime(hour);
  }

  getEventBlockHeight(event: CalendarEvent, hour: string): number {
    if (!event.time) return 0;

    const [eh, em] = event.time.split(':').map(Number);
    const eventStartMin = eh * 60 + em;
    const duration = event.durationMinutes ?? 30;
    const eventEndMin = eventStartMin + duration;

    const [h, period] = hour.split(' ');
    let [hr, _] = h.split(':').map(Number);
    if (period === 'PM' && hr !== 12) hr += 12;
    if (period === 'AM' && hr === 12) hr = 0;

    const slotStartMin = hr * 60;
    const slotEndMin = slotStartMin + 60;

    const overlapStart = Math.max(slotStartMin, eventStartMin);
    const overlapEnd = Math.min(slotEndMin, eventEndMin);
    const overlap = Math.max(0, overlapEnd - overlapStart);

    // If this is the start hour, apply a 30px min height
    if (eventStartMin >= slotStartMin && eventStartMin < slotEndMin) {
      return Math.max(overlap, 30);
    }

    // Otherwise, it's a continuation block — apply 15px min height
    return Math.max(overlap, 20);
  }
}
