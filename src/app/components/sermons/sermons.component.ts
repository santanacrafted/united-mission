import { Component, OnInit } from '@angular/core';
import { VideoCheckerComponent } from '../../shared/components/video-checker/video-checker.component';
import { CommonModule } from '@angular/common';
import { VideoEmbedComponent } from '../../shared/components/video-embed/video-embed.component';
import { Observable } from 'rxjs';
import { Store } from '@ngrx/store';
import {
  selectYouTubeVideos,
  selectYouTubeVideosIsLoading,
} from '../../state/videos/videos.selector';
import {
  filterVideos,
  loadYouTubePlayListVideos,
  sortVideos,
} from '../../state/videos/videos.actions';
import { SermonsModel } from '../../shared/components/video-checker/youtube.model';
import { ClickOutsideModule } from 'ng-click-outside';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'app-sermons',
  imports: [
    VideoCheckerComponent,
    CommonModule,
    VideoEmbedComponent,
    ClickOutsideModule,
    TranslateModule,
  ],
  templateUrl: './sermons.component.html',
  styleUrl: './sermons.component.scss',
})
export class SermonsComponent implements OnInit {
  sermons = [
    {
      title: 'Faith Over Fear',
      date: '2024-12-01',
      speaker: 'Pastor John',
      videoUrl: 'https://www.youtube.com/watch?v=VIDEO_ID1',
      thumbnail: 'https://img.youtube.com/vi/VIDEO_ID1/hqdefault.jpg',
    },
    {
      title: 'The Power of Prayer',
      date: '2024-11-24',
      speaker: 'Pastor Sarah',
      videoUrl: 'https://www.youtube.com/watch?v=VIDEO_ID2',
      thumbnail: 'https://img.youtube.com/vi/VIDEO_ID2/hqdefault.jpg',
    },
    // Add more as needed
  ];

  selectedSermon: any = null;
  youtubeVideos$?: Observable<SermonsModel[]>;
  loading$?: Observable<boolean>;

  constructor(private store: Store) {
    this.youtubeVideos$ = this.store.select(selectYouTubeVideos);
    this.loading$ = this.store.select(selectYouTubeVideosIsLoading);
  }

  ngOnInit(): void {
    this.store.dispatch(loadYouTubePlayListVideos());
  }

  getEmbedUrl(url: string): string {
    const videoId = url.split('v=')[1];
    return `https://www.youtube.com/embed/${videoId}`;
  }

  selectSermon(sermon: any) {
    this.selectedSermon = sermon;
  }

  onSortChange(value: any) {
    const order: 'oldest' | 'newest' = value.target.value;
    this.store.dispatch(sortVideos({ order }));
  }

  onSearch(value: any) {
    this.store.dispatch(filterVideos({ search: value.target.value }));
  }
}
