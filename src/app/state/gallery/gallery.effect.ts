import { Injectable } from '@angular/core';
import { GalleryService } from '../../components/gallery/gallery.service';
import {
  loadGalleryEvents,
  loadGalleryEventsSuccess,
  loadEventGallery,
  loadEventGallerySuccess,
} from './gallery.actions';
import {
  map,
  mergeMap,
  catchError,
  of,
  from,
  withLatestFrom,
  filter,
} from 'rxjs';
import { Actions, createEffect, ofType } from '@ngrx/effects';
import { select, Store } from '@ngrx/store';
import {
  selectGalleryEventHasData,
  selectGalleryState,
} from './gallery.selector';

@Injectable()
export class GalleryEffects {
  loadGalleryEvents$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadGalleryEvents),
      withLatestFrom(this.store.pipe(select(selectGalleryEventHasData))),
      filter(([_, hasData]) => !hasData),
      mergeMap(() => {
        return this.galleryService.getGalleryEvents().pipe(
          map((events) => loadGalleryEventsSuccess({ events })),
          catchError((error) =>
            of({ type: '[Event Gallery] Load Gallery Events Failure', error })
          )
        );
      })
    )
  );

  loadEventGallery$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadEventGallery),
      withLatestFrom(this.store.select(selectGalleryState)),
      filter(([action, state]) => !state.eventImages[action.eventId]), // 💡 fix here
      mergeMap(([action]) =>
        from(this.galleryService.getEventImages(action.eventId)).pipe(
          map((images) =>
            loadEventGallerySuccess({ eventId: action.eventId, images })
          ),
          catchError((error) =>
            of({ type: '[Event Gallery] Load Event Gallery Failure', error })
          )
        )
      )
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private galleryService: GalleryService
  ) {}
}
