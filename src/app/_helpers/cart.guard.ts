import { Injectable } from '@angular/core';
import {
  Router,
  CanActivate,
  ActivatedRouteSnapshot,
  RouterStateSnapshot,
} from '@angular/router';
import { StateWithSm } from '@app/super-market/state&service/sm.reducer';
import { Store } from '@ngrx/store';
import { catchError, first, map, Observable, of } from 'rxjs';
// import { AccountService } from '@app/_services';

/* The auth guard is an angular route guard that's used to prevent unauthenticated users
from accessing restricted routes, it does this by implementing the CanActivate interface
which allows the guard to decide if a route can be activated with the canActivate() 
method. If the method returns true the route is activated (allowed to proceed),
otherwise if the method returns false the route is blocked.

The auth guard uses the account service to check if the user is logged in,
if they are logged in it returns true from the canActivate() method, otherwise it returns
false and redirects the user to the login page along with the returnUrl in the query 
parameters.

Angular route guards are attached to routes in the router config, this auth guard is used 
in app-routing.module.ts to protect the home page route.
*/

@Injectable({ providedIn: 'root' })
export class CartGuard implements CanActivate {
  constructor(private router: Router, private store: Store<StateWithSm>) {}

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean> {
    return this.store
      .select((state) => state)
      .pipe(
        map((state) => {
          const isStateLoadedWithCart = state.sm?.cart?._id ? true : false;
          const isAdmin = state.account.user.isAdmin ? true : false;
          console.log(
            `State is loaded with user's cart?`,
            isStateLoadedWithCart
          );
          // (if user is admin cartGuard will pass you through)
          if (isStateLoadedWithCart || isAdmin) return true;
          else {
            this.router.navigate(['/doorman']);
            return false;
          }
        }),
        catchError(() => {
          this.router.navigate(['/doorman']);
          return of(false);
        })
      );
  }
}
