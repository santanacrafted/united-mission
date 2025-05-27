import { Component } from '@angular/core';
import { YouTubeService } from './youtube.service';

@Component({
  selector: 'app-video-checker',
  imports: [],
  templateUrl: './video-checker.component.html',
  styleUrl: './video-checker.component.scss',
})
export class VideoCheckerComponent {
  liveVideoUrl: string | null = null;
  private intervalId: any;

  // Your event schedule
  events = [
    { day: 'Wednesday', time: '8:00pm' },
    { day: 'Thursday', time: '4:45pm' },
    { day: 'Friday', time: '8:00pm' },
    { day: 'Saturday', time: '10:00am' },
  ];

  constructor(private youtube: YouTubeService) {}

  ngOnInit(): void {
    console.log('here');

    this.intervalId = setInterval(() => {
      if (this.liveVideoUrl) return;
      console.log('here1');

      const now = new Date();
      const currentDay = now.toLocaleDateString('en-US', { weekday: 'long' });
      const currentTime = now.toLocaleTimeString('en-US', {
        hour: 'numeric',
        minute: '2-digit',
        hour12: true,
      });
      console.log('here2');
      console.log(currentDay);
      console.log(currentTime);

      const match = this.events.find(
        (e) =>
          e.day.toLowerCase() === currentDay.toLowerCase() &&
          this.normalize(e.time) === this.normalize(currentTime)
      );

      console.log(match);
      if (match) {
        this.youtube.checkLive().subscribe((link) => {
          console.log('checking.......');
          console.log(link);

          if (link) {
            this.liveVideoUrl = link;
            clearInterval(this.intervalId);
            console.log('🔴 Live Now:', link);
          }
        });
      }
    }, 3000);
  }

  normalize(time: string): string {
    return time.trim().toLowerCase().replace(/\s/g, '');
  }

  ngOnDestroy(): void {
    clearInterval(this.intervalId);
  }
}
