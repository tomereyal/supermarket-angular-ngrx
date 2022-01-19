import { registerUserFailure } from '../account/state&service/account.actions';
import { loginUserFailure } from '@app/account/state&service/account.actions';
import { ActionReducerMap, createReducer, MetaReducer, on } from '@ngrx/store';
import { environment } from '../../environments/environment';
import { requestFailure } from '@app/actions';

export interface State {
  error: any;
}

const errorReducer = createReducer(
  '',
  on(requestFailure, (state, payload) => {
    return { ...payload.error };
  })
);

export const reducers: ActionReducerMap<State> = {
  error: errorReducer,
};

export const metaReducers: MetaReducer<State>[] = !environment.production
  ? []
  : [];
