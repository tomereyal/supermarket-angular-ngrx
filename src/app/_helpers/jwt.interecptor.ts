import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
} from '@angular/common/http';
import { first, flatMap, mergeMap, Observable } from 'rxjs';
import { AccountService } from '@app/account/state&service/account.service';
import { Store } from '@ngrx/store';
import { State } from '@app/reducers';
import { StateWithUser } from '@app/account/state&service/account.reducer';

/*
The JWT Interceptor intercepts http requests from the application to add a JWT auth token 
to the Authorization header if the user is logged in and the request is to the application 
api url (environment.apiUrl).

It's implemented using the HttpInterceptor interface included in the HttpClientModule, by 
implementing the HttpInterceptor interface you can create a custom interceptor to modify 
http requests before they get sent to the server.

Http interceptors are added to the request pipeline in the providers section of the 
app.module.ts file.

*/

@Injectable()
export class JwtInterceptor implements HttpInterceptor {
  constructor(
    private accountService: AccountService,
    private store: Store<StateWithUser>
  ) {}

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return this.store
      .select((state) => state.account?.user) //select account.user when no account field was there caused the code below not to runa nd therefor the request not to be sent..
      .pipe(
        first(),
        mergeMap((user) => {
          const isLoggedIn = user && user.token;
          const isApiUrl = request.url.startsWith(environment.apiUrl);
          const authReq =
            isLoggedIn && isApiUrl
              ? request.clone({
                  setHeaders: { Authorization: 'Bearer ' + user.token },
                })
              : request;

          return next.handle(authReq);
        })
      );
  }
}

/*
Helped by:
https://antonyderham.me/post/angular-ngrx-auth-interceptor/
*/
