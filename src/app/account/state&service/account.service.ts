import {
  loginUserSuccess,
  loginUserFailure,
  registerUserSuccess,
  registerUserFailure,
  loginUser,
  registerUser,
  logoutUser,
} from './account.actions';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Store } from '@ngrx/store';
import { environment } from 'src/environments/environment';
import { State } from '../../reducers';
import IUser from '../../interfaces/user.interface';
import { requestFailure } from '../../actions';
import { map, tap, take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AccountService {
  user: IUser;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private http: HttpClient,
    private store: Store<State>
  ) {
    // const storedUser = localStorage.getItem('user');
    // if (storedUser) {
    //   this.user = JSON.parse(storedUser);
    //   console.log(`account service: user`, this.user);
    //   if (this.user) {
    //     this.store.dispatch(loginUserSuccess({ user: this.user }));
    //     this.router.navigate(['..'], { relativeTo: this.route });
    //   }
    // }
  }

  async login(credentials: { email: string; password: string }) {
    this.store.dispatch(loginUser());
    return this.http
      .post<{ user: IUser }>(`${environment.apiUrl}/users/getUser`, credentials)
      .pipe(take(1))
      .toPromise()
      .then((result) => {
        if (result?.user) {
          localStorage.setItem('user', JSON.stringify(result.user));
          this.store.dispatch(loginUserSuccess({ user: result?.user }));
        }
        console.log(`result`, result);
        return result?.user;
        // console.log(`account service wants to navigate to:`, '..');
      })
      .catch((error) => {
        console.log(`error`, error);
        return error?.error?.message;
      });
  }

  logout() {
    localStorage.removeItem('user');
    this.store.dispatch(logoutUser());
    this.router.navigate(['/account/login']);
  }

  async register(
    newUser: Omit<IUser, 'token' | '_id' | 'isAdmin'> & { password: string }
  ) {
    this.store.dispatch(registerUser());

    return this.http
      .post<{ user: IUser; token: string }>(
        `${environment.apiUrl}/users/register`,
        newUser
      )
      .pipe(take(1))
      .toPromise()
      .then((data) => {
        const user = data?.user;
        const token = data?.token;
        if (user && token) {
          localStorage.setItem('user', JSON.stringify(user));
          this.store.dispatch(
            registerUserSuccess({ user: { ...user, token } })
          );
          return user;
        }
      })
      .catch((error) => {
        console.log(`error`, error);
        return error?.error?.message;
      });
  }

  isEmailTaken(email: string) {
    return this.http.post<{ isEmailTaken: boolean }>(
      `${environment.apiUrl}/users/isEmailTaken`,
      { email }
    );
  }

  getProductCount() {
    return this.http
      .get<{ productCount: number }>(`${environment.apiUrl}/products/count`)
      .pipe(map((data) => data.productCount));
  }
  getOrderCount() {
    return this.http
      .get<{ orderCount: number }>(`${environment.apiUrl}/orders/count`)
      .pipe(map((data) => data.orderCount));
  }
}
