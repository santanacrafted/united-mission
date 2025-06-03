import { Injectable } from '@angular/core';
import { GalleryService } from '../../components/gallery/gallery.service';
import {
  loadGalleryEvents,
  loadGalleryEventsSuccess,
  loadEventGallery,
  loadEventGallerySuccess,
  deleteSelectedImages,
  deleteSelectedImagesSuccess,
  deleteSelectedImagesFailure,
  addImagesToAlbum,
  addImagesToAlbumSuccess,
  addImagesToAlbumFailure,
  updateAlbum,
  updateAlbumSuccess,
  updateAlbumFailure,
  createAlbumFailure,
  createAlbumSuccess,
  createAlbum,
  deleteAlbum,
  deleteAlbumSuccess,
  deleteAlbumFailure,
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

  deleteSelectedImages$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteSelectedImages),
      mergeMap(({ eventId, imageUrls }) =>
        from(this.galleryService.deleteImagesFromStorage(imageUrls)).pipe(
          map(() => deleteSelectedImagesSuccess({ eventId })),
          catchError((error) => of(deleteSelectedImagesFailure({ error })))
        )
      )
    )
  );

  addImagesToAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(addImagesToAlbum),
      mergeMap(({ eventId, files }) => {
        return from(this.galleryService.addImagesToAlbum(eventId, files)).pipe(
          map((res) => {
            const imageUrls = res.data.images.map((img: any) => img.url);
            return addImagesToAlbumSuccess({ eventId, imageUrls });
          }),
          catchError((error) => {
            console.error('Upload failed', error);
            return of(addImagesToAlbumFailure({ error }));
          })
        );
      })
    )
  );

  updateAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(updateAlbum),
      mergeMap(
        ({
          albumId,
          updatedTitleEn,
          updatedTitleEs,
          updatedDescriptionEn,
          updatedDescriptionEs,
          newCoverPhotoFile,
        }) =>
          from(
            this.galleryService.updateAlbum(
              albumId,
              updatedTitleEn,
              updatedTitleEs,
              updatedDescriptionEn,
              updatedDescriptionEs,
              newCoverPhotoFile
            )
          ).pipe(
            map((res) => {
              return updateAlbumSuccess({
                albumId,
                updatedFields: {
                  name: {
                    en: updatedTitleEn,
                    es: updatedTitleEs,
                  },
                  description: {
                    en: updatedDescriptionEn,
                    es: updatedDescriptionEs,
                  },
                  ...(res.data.coverImage && {
                    coverImage: res.data.coverImage,
                  }),
                },
              });
            }),
            catchError((error) => of(updateAlbumFailure({ error })))
          )
      )
    )
  );

  createAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(createAlbum),
      mergeMap(
        ({
          albumName,
          albumNameEs,
          description,
          descriptionEs,
          coverPhotoFile,
          selectedImages,
        }) => {
          return from(
            this.galleryService.createAlbum(
              albumName,
              albumNameEs,
              description,
              descriptionEs,
              coverPhotoFile,
              selectedImages
            )
          ).pipe(
            map((res: any) => {
              console.log(res);
              return createAlbumSuccess({
                album: {
                  id: res.albumId,
                  name: { en: albumName, es: albumNameEs },
                  description: { en: description, es: descriptionEs },
                  coverImage: res.coverPhotoUrl, // optional: include in return from service
                  totalItems: selectedImages.length + 1,
                  createdAt: new Date().toISOString(), // or from server if returned
                },
              });
            }),
            catchError((error) => of(createAlbumFailure({ error })))
          );
        }
      )
    )
  );

  deleteAlbum$ = createEffect(() =>
    this.actions$.pipe(
      ofType(deleteAlbum),
      mergeMap(({ albumId }) =>
        from(this.galleryService.deleteAlbum(albumId)).pipe(
          map(() => deleteAlbumSuccess({ albumId })),
          catchError((error) => of(deleteAlbumFailure({ error })))
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
