import { createFeatureSelector, createSelector } from '@ngrx/store';
import { VideosState } from './videos.reducer';

export const selectVideosState =
  createFeatureSelector<VideosState>('videosState');

export const selectYouTubeVideos = createSelector(
  selectVideosState,
  (state) => state.filtered
);

export const selectYouTubeVideosHasData = createSelector(
  selectVideosState,
  (state) => state.youtube_videos.length > 0
);

export const selectYouTubeVideosIsLoading = createSelector(
  selectVideosState,
  (state) => state.loading
);
