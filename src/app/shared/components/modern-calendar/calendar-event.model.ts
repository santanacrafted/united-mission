export interface CalendarEvent {
  id: string;
  title: string;
  description?: string;
  file?: any;
  link?: string;
  date: string; // 'YYYY-MM-DD'
  time?: string; // 'HH:mm'
  durationMinutes?: number;
  recurrence?: 'daily' | 'weekly' | 'monthly';
  category?: string;
}
