import { createFeatureSelector, createSelector } from '@ngrx/store';
import { MinistriesState } from './ministries.reducer';

export const selectMinistriesState =
  createFeatureSelector<MinistriesState>('ministriesState');

export const selectMinistries = createSelector(
  selectMinistriesState,
  (state) => state.ministries
);

export const selectMinistriesHasData = createSelector(
  selectMinistriesState,
  (state) => state.ministries.length > 0
);

export const selectMinistriesLoading = createSelector(
  selectMinistriesState,
  (state) => state.loading
);
