import { createAction, props } from '@ngrx/store';
import { Ministries } from '../../components/ministries/ministries.model';

export const loadMinistries = createAction('[Ministries] Load Ministries');

export const loadMinistriesSuccess = createAction(
  '[Ministries] Load Ministries Success',
  props<{ ministries: Ministries[] }>()
);
