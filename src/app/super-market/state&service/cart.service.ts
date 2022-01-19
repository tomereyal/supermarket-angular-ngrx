import ICartItem from '@app/interfaces/cartItem.interface';
import IProduct from '@app/interfaces/product.interface';
import { StateWithSm } from './sm.reducer';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import ICart from '@app/interfaces/cart.interface';
import { environment } from 'src/environments/environment';
import {
  getCartSuccess,
  createCartSuccess,
  createCart,
  addCartItem,
  addCartItemSuccess,
  updateCartItemAmountSuccess,
  updateCartItemAmount,
  removeCartItem,
  removeCartItemSuccess,
  emptyCart,
} from './cart.actions';
import { requestFailure } from '@app/actions';
import { take } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  constructor(private http: HttpClient, private store: Store<StateWithSm>) {}

  async getCart() {
    return this.http
      .get<{ cart: ICart }>(`${environment.apiUrl}/carts/getCart`)
      .pipe(take(1))
      .toPromise()
      .then((data) => {
        if (data) {
          console.log(`cartService: retrieved cart :`, data);
          this.store.dispatch(getCartSuccess(data));
          return data.cart;
        }
      })
      .catch((error) => {
        requestFailure(error);
      });
  }

  async emptyCart() {
    return this.http
      .put<{ deleted: boolean }>(
        `${environment.apiUrl}/carts/deleteAllCartItems`,
        {}
      )
      .pipe(take(1))
      .toPromise()
      .then((data) => {
        if (data?.deleted) this.store.dispatch(emptyCart());
      })
      .catch((e) => {
        this.store.dispatch(requestFailure(e));
      });
  }

  async createCart() {
    this.store.dispatch(createCart());
    return this.http
      .post<{ cart: ICart }>(`${environment.apiUrl}/carts/create`, {})
      .pipe(take(1))
      .toPromise()
      .then((result) => {
        if (result?.cart) {
          this.store.dispatch(createCartSuccess({ cart: result.cart }));
        }
        return result;
      })
      .catch((error) => {
        this.store.dispatch(requestFailure(error));
        return error;
      });
  }

  deleteCart(cartId: string) {
    this.http
      .delete<{ deleted: boolean }>(`${environment.apiUrl}/carts/${cartId}`)
      .pipe(take(1))
      .toPromise()
      .then((result) => {
        if (result?.deleted) return result;
      })
      .catch((error) => {
        this.store.dispatch(requestFailure(error));
        return error;
      });
  }

  addCartItem(productRef: string, amount: number) {
    this.store.dispatch(addCartItem());

    this.http
      .put<{ cartItem: ICartItem }>(`${environment.apiUrl}/carts/addCartItem`, {
        productRef,
        amount,
      })
      .subscribe({
        next: (data) => {
          console.log(`data`, data);
          this.store.dispatch(addCartItemSuccess(data));
        },
        error: (error) => {
          this.store.dispatch(requestFailure(error));
        },
      });
  }

  updateCartItemAmount(cartItemId: string, productRef: string, amount: number) {
    this.store.dispatch(updateCartItemAmount());
    this.http
      .put<{ updated: boolean }>(
        `${environment.apiUrl}/carts/updateCartItemAmount/${cartItemId}`,
        {
          amount,
        }
      )
      .subscribe({
        next: ({ updated }) => {
          if (updated)
            this.store.dispatch(
              updateCartItemAmountSuccess({ productRef, amount })
            );
        },
        error: (error) => {
          this.store.dispatch(requestFailure(error));
        },
      });
  }
  removeCartItem(cartItemId: string, productRef: string) {
    this.store.dispatch(removeCartItem());
    this.http
      .delete<{ deleted: boolean }>(
        `${environment.apiUrl}/carts/deleteCartItem/${cartItemId}`
      )
      .subscribe({
        next: ({ deleted }) => {
          if (deleted)
            this.store.dispatch(removeCartItemSuccess({ productRef }));
        },
        error: (error) => {
          this.store.dispatch(requestFailure(error));
        },
      });
  }
}
