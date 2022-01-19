import { createAction, props } from '@ngrx/store';

export const requestFailure = createAction(
  '[APP] App Failure',
  props<{ error: any }>()
);
