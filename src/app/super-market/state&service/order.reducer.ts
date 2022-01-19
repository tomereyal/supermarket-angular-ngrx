import { createReducer } from '@ngrx/store';
import IOrder from '@app/interfaces/order.interface';
import { on } from '@ngrx/store';

import {
  addCartToOrder,
  addCartToOrderSuccess,
  addCustomerToOrder,
  addCustomerToOrderSuccess,
  addTotalPriceToOrder,
  getPreviousOrdersSuccess,
  submitOrder,
  submitOrderSuccess,
} from './order.actions';

const initPrevOrders: IOrder[] = [];
const initOrder: IOrder = {
  _id: '',
  customer: {
    firstName: '',
    lastName: '',
    address: { city: '', street: '' },
    email: '',
    _id: '',
  },
  cart: {
    _id: '',
    createdAt: '',
    customerRef: '',
    cartItems: [],
  },
  totalPrice: -1,
  destination: { city: '', street: '' },
  timeOfArrival: '',
  paymentDigits: -1,
  createdAt: '',
};
export const orderReducer = createReducer(
  initOrder,
  on(addCartToOrderSuccess, (state, { cart }) => ({ ...state, cart })),
  on(addCustomerToOrderSuccess, (state, { customer }) => ({
    ...state,
    customer,
  })),
  on(addTotalPriceToOrder, (state, { totalPrice }) => ({
    ...state,
    totalPrice,
  })),
  on(submitOrderSuccess, () => initOrder)
);
export const loadingOrderReducer = createReducer(
  false,
  on(addCartToOrder, addCustomerToOrder, submitOrder, () => true),
  on(
    addCartToOrderSuccess,
    addCustomerToOrderSuccess,
    submitOrderSuccess,
    () => false
  )
);
export const prevOrdersReducer = createReducer(
  initPrevOrders,
  on(submitOrderSuccess, (state, { order }) => [order, ...state]),
  on(getPreviousOrdersSuccess, (state, { previousOrders }) => previousOrders)
);
