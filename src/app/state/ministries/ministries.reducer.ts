import { createReducer, on } from '@ngrx/store';
import * as MinistriesActions from './ministries.actions';
import { Ministries } from '../../components/ministries/ministries.model';

export interface MinistriesState {
  ministries: Ministries[];
  loading: boolean;
}

export const initialState: MinistriesState = {
  ministries: [],
  loading: false,
};

export const ministriesReducer = createReducer(
  initialState,
  on(MinistriesActions.loadMinistries, (state) => ({
    ...state,
    loading: state.ministries.length > 0 ? false : true,
  })),
  on(MinistriesActions.loadMinistriesSuccess, (state, { ministries }) => ({
    ...state,
    ministries,
    loading: false,
  }))
);
