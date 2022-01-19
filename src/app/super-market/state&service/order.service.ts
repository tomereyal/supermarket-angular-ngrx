import { requestFailure } from '@app/actions';
import { environment } from 'src/environments/environment';
import ICart from '@app/interfaces/cart.interface';
import { ICartWithHashedItems } from './cart.reducer';
import IUser from '@app/interfaces/user.interface';
import {
  addTotalPriceToOrder,
  addCartToOrderSuccess,
  addCustomerToOrderSuccess,
  submitOrder,
  submitOrderSuccess,
  getPreviousOrdersSuccess,
} from './order.actions';
import IOrder, {
  IOrderCartItem,
  IOrderCustomer,
} from '@app/interfaces/order.interface';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';
import { StateWithSm } from './sm.reducer';
import { of, take } from 'rxjs';
@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient, private store: Store<StateWithSm>) {}

  async addCustomerToOrder() {
    this.store
      .select((state) => state.account.user)
      .pipe(take(1))
      .toPromise()
      .then((c: IUser | undefined) => {
        if (!c) return;
        const customer: IOrderCustomer = {
          firstName: c.firstName,
          lastName: c.lastName,
          _id: c._id,
          email: c.email,
          address: c.address,
        };
        this.store.dispatch(addCustomerToOrderSuccess({ customer }));
      });
  }
  async addCartToOrder() {
    this.store
      .select((state) => state.sm.cart)
      .pipe(take(1))
      .toPromise()
      .then((c: ICartWithHashedItems | undefined) => {
        if (!c) return;
        let cartItems = [];
        for (let productRef in c.cartItems) {
          const i = c.cartItems[productRef];
          const p = i.productRef;
          const product = {
            _id: p._id,
            name: p.name,
            price: p.price,
            url: p.url,
            category: p.categoryRef,
          };
          const orderItem: IOrderCartItem = {
            _id: i._id,
            amount: i.amount,
            product,
          };
          cartItems.push(orderItem);
        }
        const cart: ICart = { ...c, cartItems };
        this.store.dispatch(addCartToOrderSuccess({ cart }));
      });
  }
  async addTotalPriceToOrder(totalPrice: number) {
    this.store.dispatch(addTotalPriceToOrder({ totalPrice }));
  }

  async submitOrder(order: Partial<IOrder>) {
    this.store.dispatch(submitOrder());
    return this.http
      .post<{ newOrderId: string; createdAt: string }>(
        `${environment.apiUrl}/orders/create`,
        order
      )
      .pipe(take(1))
      .toPromise()
      .then((data) => {
        if (data) {
          const { newOrderId, createdAt } = data;

          const orderWithId = {
            ...order,
            _id: newOrderId,
            createdAt,
          } as IOrder;
          this.store.dispatch(submitOrderSuccess({ order: orderWithId }));
          return data;
        }
      })
      .catch((error) => {
        console.log(`error`, error);
        this.store.dispatch(requestFailure(error));
      });
  }
  isDateAvailable(date: string) {
    return this.http.get<{ isDateAvailable: boolean }>(
      `${environment.apiUrl}/orders/isDateAvailable/${date}`
    );
  }

  async getForbiddenDates() {
    return this.http
      .get<{ forbiddenDates: boolean }>(
        `${environment.apiUrl}/orders/forbiddenOrderDates`
      )
      .pipe(take(1))
      .toPromise()
      .then((data) => {
        if (data?.forbiddenDates) return data.forbiddenDates;
      })
      .catch((error) => {
        this.store.dispatch(requestFailure(error));
      });
  }

  //IS NOT BEING USED..
  getPaymentConfirmation(data: {
    source: any;
    customerId: string;
    amount: number;
  }) {
    //this method will send the payment details to the server (or the stripe backend server directly)
    //and then return a token if the payment transaction was successful.
    return of('1234ABCD');
  }

  async getPreviousOrders() {
    console.log(`working`);
    return this.http
      .get<{ previousOrders: IOrder[] }>(
        `${environment.apiUrl}/orders/previous`
      )
      .pipe(take(1))
      .toPromise()
      .then((data) => {
        if (data?.previousOrders) {
          this.store.dispatch(
            getPreviousOrdersSuccess({ previousOrders: data.previousOrders })
          );
          return data;
        }
      })
      .catch((error) => {
        console.log(`error`, error);
        this.store.dispatch(requestFailure(error));
      });
  }
}
