import { createAction, props } from '@ngrx/store';
import { YouTubePlaylistItem } from '../../shared/components/video-checker/youtube.model';

export const loadYouTubePlayListVideos = createAction(
  '[YouTube] Load YouTube PlayList Videos'
);

export const loadYouTubePlayListVideosSuccess = createAction(
  '[YouTube] Load YouTube PlayList Videos Success',
  props<{ youtube_videos: YouTubePlaylistItem[] }>()
);

export const sortVideos = createAction(
  '[Videos] Sort',
  props<{ order: 'newest' | 'oldest' }>()
);

export const filterVideos = createAction(
  '[Videos] Filter',
  props<{ search: string }>()
);
