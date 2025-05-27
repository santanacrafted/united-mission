import { Injectable } from '@angular/core';
import { MinistriesService } from '../../components/ministries/ministries.service';
import { loadMinistries, loadMinistriesSuccess } from './ministries.actions';
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
import { selectMinistriesHasData } from './ministries.selector';

@Injectable()
export class MinistriesEffects {
  loadMinistries$ = createEffect(() =>
    this.actions$.pipe(
      ofType(loadMinistries),
      withLatestFrom(this.store.pipe(select(selectMinistriesHasData))),
      filter(([_, hasData]) => !hasData),
      mergeMap(() => {
        return this.ministriesService.getMinistries().pipe(
          map((ministries) => loadMinistriesSuccess({ ministries })),
          catchError((error) =>
            of({ type: '[Ministries] Load Ministries Failure', error })
          )
        );
      })
    )
  );

  constructor(
    private actions$: Actions,
    private store: Store,
    private ministriesService: MinistriesService
  ) {}
}
