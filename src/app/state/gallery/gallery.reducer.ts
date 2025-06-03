import { createReducer, on } from '@ngrx/store';
import * as GalleryActions from './gallery.actions';
import { GalleryEvent } from '../../components/gallery/gallery.model';

export interface GalleryState {
  events: GalleryEvent[];
  eventImages: {
    [eventId: string]: string[];
  };
  selectedImages: {
    [eventId: string]: string[];
  };
  loading: boolean;
}

export const initialState: GalleryState = {
  events: [],
  eventImages: {},
  selectedImages: {},
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
  })),
  on(GalleryActions.selectAllImages, (state, { eventId, images }) => ({
    ...state,
    selectedImages: {
      ...state.selectedImages,
      [eventId]: [...images],
    },
  })),

  on(GalleryActions.clearSelectedImages, (state, { eventId }) => ({
    ...state,
    selectedImages: {
      ...state.selectedImages,
      [eventId]: [],
    },
  })),
  on(GalleryActions.toggleSelectImage, (state, { eventId, imageUrl }) => {
    const currentSelected = state.selectedImages[eventId] || [];
    const alreadySelected = currentSelected.includes(imageUrl);

    return {
      ...state,
      selectedImages: {
        ...state.selectedImages,
        [eventId]: alreadySelected
          ? currentSelected.filter((img) => img !== imageUrl)
          : [...currentSelected, imageUrl],
      },
    };
  }),

  on(GalleryActions.deleteSelectedImages, (state, { eventId }) => {
    const selectedToDelete = state.selectedImages[eventId] || [];
    const remainingImages = (state.eventImages[eventId] || []).filter(
      (img) => !selectedToDelete.includes(img)
    );

    return {
      ...state,
      eventImages: {
        ...state.eventImages,
        [eventId]: remainingImages,
      },
      selectedImages: {
        ...state.selectedImages,
        [eventId]: [],
      },
    };
  }),
  on(
    GalleryActions.addImagesToAlbumSuccess,
    (state, { eventId, imageUrls }) => ({
      ...state,
      eventImages: {
        ...state.eventImages,
        [eventId]: [...(state.eventImages[eventId] || []), ...imageUrls],
      },
    })
  ),

  on(
    GalleryActions.updateAlbumSuccess,
    (state, { albumId, updatedFields }) => ({
      ...state,
      events: state.events.map((album) =>
        album.id === albumId
          ? {
              ...album,
              ...updatedFields,
            }
          : album
      ),
    })
  ),

  on(GalleryActions.updateAlbumSuccess, (state, { albumId, updatedFields }) => {
    console.log(updatedFields);
    return {
      ...state,
      events: state.events.map((album) =>
        album.id === albumId
          ? {
              ...album,
              ...updatedFields,
            }
          : album
      ),
    };
  }),
  on(GalleryActions.createAlbumSuccess, (state, { album }) => ({
    ...state,
    events: [...state.events, album],
    loading: false,
  })),

  on(GalleryActions.createAlbumFailure, (state) => ({
    ...state,
    loading: false,
  })),
  on(GalleryActions.deleteAlbumSuccess, (state, { albumId }) => {
    const { [albumId]: removedImages, ...remainingEventImages } =
      state.eventImages;
    const { [albumId]: removedSelected, ...remainingSelectedImages } =
      state.selectedImages;

    return {
      ...state,
      events: state.events.filter((event) => event.id !== albumId),
      eventImages: remainingEventImages,
      selectedImages: remainingSelectedImages,
    };
  })
);
