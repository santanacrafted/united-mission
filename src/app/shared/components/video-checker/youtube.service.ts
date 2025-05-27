// src/app/services/youtube.service.ts

import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class YouTubeService {
  private API_KEY = 'AIzaSyA703ZADCLqlUtLzF7GK2UNg4jAEvjfXUM';
  private CHANNEL_ID = 'UCSaqriGXgU3rbOOda0w6YpA';
  private PLAYLIST_ID = 'PLltNahYVzsBoreTCED78Y5hQXYsQ16UwC';

  constructor(private http: HttpClient) {}

  // 🔴 Check if live now
  checkLive(): Observable<string | null> {
    const url = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${this.CHANNEL_ID}&eventType=live&type=video&key=${this.API_KEY}`;
    return this.http.get<any>(url).pipe(
      map((res) => {
        const video = res.items?.[0];
        return video
          ? `https://www.youtube.com/watch?v=${video.id.videoId}`
          : null;
      })
    );
  }

  // 📺 Fetch all videos from a playlist
  fetchPlaylistVideos(): Observable<any[]> {
    const url = `https://www.googleapis.com/youtube/v3/playlistItems?part=snippet&playlistId=${this.PLAYLIST_ID}&maxResults=50&key=${this.API_KEY}`;
    return this.http.get<any>(url).pipe(map((res) => res.items || []));
  }
}
