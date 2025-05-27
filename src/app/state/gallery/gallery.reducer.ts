import { createReducer, on } from '@ngrx/store';
import * as GalleryActions from './gallery.actions';
import { GalleryEvent } from '../../components/gallery/gallery.model';

export interface GalleryState {
  events: GalleryEvent[];
  eventImages: {
    [eventId: string]: string[];
  };
  loading: boolean;
}

export const initialState: GalleryState = {
  events: [],
  eventImages: {},
  loading: false,
};

export const galleryReducer = createReducer(
  initialState,

  // Load all events
  on(GalleryActions.loadGalleryEvents, (state) => ({
    ...state,
    loading: state.events.length > 0 ? false : true,
  })),
  on(GalleryActions.loadGalleryEventsSuccess, (state, { events }) => ({
    ...state,
    events,
    loading: false,
  })),

  // Load images for a specific event
  on(GalleryActions.loadEventGallery, (state, { eventId }) => {
    const alreadyLoaded = !!state.eventImages[eventId]?.length;
    return {
      ...state,
      loading: !alreadyLoaded,
    };
  }),

  on(GalleryActions.loadEventGallerySuccess, (state, { eventId, images }) => ({
    ...state,
    eventImages: {
      ...state.eventImages,
      [eventId]: images,
    },
    loading: false,
  }))
);
