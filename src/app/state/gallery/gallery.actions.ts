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
