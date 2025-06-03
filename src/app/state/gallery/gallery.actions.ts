import { createAction, props } from '@ngrx/store';
import { GalleryEvent } from '../../components/gallery/gallery.model';

export const loadGalleryEvents = createAction(
  '[Event Gallery] Load Gallery Events'
);

export const loadGalleryEventsSuccess = createAction(
  '[Event Gallery] Load Gallery Events Success',
  props<{ events: GalleryEvent[] }>()
);

export const loadEventGallery = createAction(
  '[Event Gallery] Load Event Gallery',
  props<{ eventId: string }>()
);

export const loadEventGallerySuccess = createAction(
  '[Event Gallery] Load Event Gallery Success',
  props<{ eventId: string; images: string[] }>()
);

export const toggleSelectImage = createAction(
  '[Gallery] Toggle Select Image',
  props<{ eventId: string; imageUrl: string }>()
);

export const selectAllImages = createAction(
  '[Gallery] Select All Images',
  props<{ eventId: string; images: string[] }>()
);

export const clearSelectedImages = createAction(
  '[Gallery] Clear Selected Images',
  props<{ eventId: string }>()
);

export const deleteSelectedImages = createAction(
  '[Gallery] Delete Selected Images',
  props<{ eventId: string; imageUrls: string[] }>()
);

export const deleteSelectedImagesSuccess = createAction(
  '[Gallery] Delete Selected Images Success',
  props<{ eventId: string }>()
);

export const deleteSelectedImagesFailure = createAction(
  '[Gallery] Delete Selected Images Failure',
  props<{ error: any }>()
);

// Trigger upload
export const addImagesToAlbum = createAction(
  '[Gallery] Add Images To Album',
  props<{ eventId: string; files: File[] }>()
);

// On success
export const addImagesToAlbumSuccess = createAction(
  '[Gallery] Add Images To Album Success',
  props<{ eventId: string; imageUrls: string[] }>()
);

// On failure
export const addImagesToAlbumFailure = createAction(
  '[Gallery] Add Images To Album Failure',
  props<{ error: any }>()
);

// Trigger album update
export const updateAlbum = createAction(
  '[Gallery] Update Album',
  props<{
    albumId: string;
    updatedTitleEn: string;
    updatedTitleEs: string;
    updatedDescriptionEn: string;
    updatedDescriptionEs: string;
    newCoverPhotoFile?: File;
  }>()
);

// Success
export const updateAlbumSuccess = createAction(
  '[Gallery] Update Album Success',
  props<{ albumId: string; updatedFields: any }>() // could include title/desc/coverUrl
);

// Failure
export const updateAlbumFailure = createAction(
  '[Gallery] Update Album Failure',
  props<{ error: any }>()
);

export const createAlbum = createAction(
  '[Gallery] Create Album',
  props<{
    albumName: string;
    albumNameEs: string;
    description: string;
    descriptionEs: string;
    coverPhotoFile: File;
    selectedImages: File[];
  }>()
);

export const createAlbumSuccess = createAction(
  '[Gallery] Create Album Success',
  props<{ album: GalleryEvent }>()
);

export const createAlbumFailure = createAction(
  '[Gallery] Create Album Failure',
  props<{ error: any }>()
);

export const deleteAlbum = createAction(
  '[Gallery] Delete Album',
  props<{ albumId: string }>()
);

export const deleteAlbumSuccess = createAction(
  '[Gallery] Delete Album Success',
  props<{ albumId: string }>()
);

export const deleteAlbumFailure = createAction(
  '[Gallery] Delete Album Failure',
  props<{ error: any }>()
);
