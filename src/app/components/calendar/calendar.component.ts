import { Component } from '@angular/core';
import { ModernCalendarComponent } from '../../shared/components/modern-calendar/modern-calendar.component';
import { CalendarEvent } from '../../shared/components/modern-calendar/calendar-event.model';

@Component({
  selector: 'app-calendar',
  imports: [ModernCalendarComponent],
  templateUrl: './calendar.component.html',
  styleUrl: './calendar.component.scss',
})
export class CalendarComponent {
  calendarConfig: any = { theme: 'light', showFilters: true };

  myEvents: CalendarEvent[] = [
    {
      id: '1',
      title: 'Morning Meeting',
      date: '2025-05-08',
      time: '09:00',
      durationMinutes: 75,
      category: 'meeting',
    },
    {
      id: '1',
      title: 'Work Meeting',
      date: '2025-05-08',
      time: '09:00',
      durationMinutes: 15,
      category: 'deadline',
    },
    {
      id: '1',
      title: 'Lunch Meeting',
      date: '2025-05-08',
      time: '09:00',
      durationMinutes: 60,
      category: 'default',
    },
    {
      id: '2',
      title: 'Bussiness Meeting',
      date: '2025-05-08',
      time: '13:00',
      durationMinutes: 15,
      category: 'birthday',
    },
    {
      id: '2',
      title: 'Quick Call',
      date: '2025-05-08',
      time: '13:00',
      category: 'meeting',
    },
  ];

  onNewEvent(event: CalendarEvent) {
    // this.myEvents.push(event);
    console.log('New Event:', event);
  }

  onUpdatedEvent(event: any) {
    console.log('Updated Event:', event);
  }

  onDeletedEvent(id: any) {
    this.myEvents = this.myEvents.filter((e) => e.id !== id);
    console.log('Deleted Event ID:', id);
  }
}
