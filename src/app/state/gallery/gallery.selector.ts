import { createFeatureSelector, createSelector } from '@ngrx/store';
import { GalleryState } from './gallery.reducer';

// Select the entire gallery feature state
export const selectGalleryState =
  createFeatureSelector<GalleryState>('galleryState');

// Select all gallery events
export const selectGalleryEvents = createSelector(
  selectGalleryState,
  (state) => state.events
);

export const selectGalleryEventHasData = createSelector(
  selectGalleryState,
  (state) => state.events.length > 0
);

// Select loading state
export const selectGalleryLoading = createSelector(
  selectGalleryState,
  (state) => state.loading
);

// Select all event images
export const selectGalleryEventImages = createSelector(
  selectGalleryState,
  (state) => state.eventImages
);

export const selectGalleryEventImagesHasData = createSelector(
  selectGalleryState,
  (state) => state.eventImages
);

export const selectEventImages = (eventId: string) =>
  createSelector(
    selectGalleryState,
    (state) => state.eventImages[eventId] || []
  );
