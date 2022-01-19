import {
  loginUser,
  loginUserSuccess,
  registerUser,
  loginUserFailure,
  registerUserSuccess,
  registerUserFailure,
  logoutUser,
} from './account.actions';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { on } from '@ngrx/store';
import IUser from 'src/app/interfaces/user.interface';
import { environment } from '../../../environments/environment';
import { State } from '@app/reducers';

export const accountFeatureKey = 'account';

export interface StateWithUser extends State {
  account: { user: IUser; loadingUser: boolean };
}

interface UserState {
  user: IUser;
  loadingUser: boolean;
}

const initUserState = {
  _id: '',
  firstName: '',
  lastName: '',
  email: '',
  address: { street: '', city: '' },
  isAdmin: false,
  token: '',
};

export const userReducer = createReducer(
  initUserState,
  on(loginUserSuccess, (state, { user }) => {
    console.log(`user`, user);
    return user;
  }),
  on(registerUserSuccess, (state, { user }) => {
    console.log(`user`, user);
    return user;
  }),
  on(logoutUser, (state) => initUserState)
);

export const loadingUserReducer = createReducer(
  false,
  on(loginUser, registerUser, () => {
    return true;
  }),
  on(
    loginUserSuccess,
    loginUserFailure,
    registerUserSuccess,
    registerUserFailure,
    () => {
      return false;
    }
  )
);

export const reducers: ActionReducerMap<UserState> = {
  user: userReducer,
  loadingUser: loadingUserReducer,
};

export const metaReducers: MetaReducer<UserState>[] = !environment.production
  ? []
  : [];
