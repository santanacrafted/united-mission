import { Injectable } from '@angular/core';
import { MinistriesService } from '../../components/ministries/ministries.service';
import {
  loadYouTubePlayListVideos,
  loadYouTubePlayListVideosSuccess,
} from './videos.actions';
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
import { selectYouTubeVideosHasData } from './videos.selector';
import { YouTubeService } from '../../shared/components/video-checker/youtube.service';

@Injectable()
export class VideosEffects {
  loadMinistries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadYouTubePlayListVideos),
      withLatestFrom(this.store.pipe(select(selectYouTubeVideosHasData))),
      filter(([_, hasData]) => !hasData),
      mergeMap(() => {
        return this.youtubeService.fetchPlaylistVideos().pipe(
          map((youtube_videos) =>
            loadYouTubePlayListVideosSuccess({ youtube_videos })
          ),
          catchError((error) =>
            of({
              type: '[YouTube] Load YouTube PlayList Videos Failure',
              error,
            })
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private youtubeService: YouTubeService
  ) {}
}
