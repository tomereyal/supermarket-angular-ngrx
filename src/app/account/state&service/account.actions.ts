import { createAction, props } from '@ngrx/store';
import IUser from '@app/interfaces/user.interface';

export const loginUser = createAction('[USER] Login User');
export const loginUserSuccess = createAction(
  '[USER] Login User Success',
  props<{ user: IUser }>()
);
export const loginUserFailure = createAction(
  '[USER] Login User Failure',
  props<{ error: any }>()
);

export const registerUser = createAction('[USER] Register User');
export const registerUserSuccess = createAction(
  '[USER] Register User Success',
  props<{ user: IUser }>()
);
export const registerUserFailure = createAction(
  '[USER] Register User Failure',
  props<{ error: any }>()
);

export const logoutUser = createAction('[USER] Logout User');
