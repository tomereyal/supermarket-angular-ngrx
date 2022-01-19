import IOrder from '@app/interfaces/order.interface';
import ICart from '@app/interfaces/cart.interface';
import IUser from '@app/interfaces/user.interface';
import { createAction, props } from '@ngrx/store';

export const addCartToOrder = createAction(`[ORDER] AddCart Order `);

export const addCartToOrderSuccess = createAction(
  `[ORDER] AddCart Order Success`,
  props<{ cart: ICart }>()
);
export const addCustomerToOrder = createAction(`[ORDER] AddCustomer Order `);

export const addCustomerToOrderSuccess = createAction(
  `[ORDER] AddCustomer Order Success`,
  props<{ customer: Omit<IUser, 'isAdmin' | 'token'> }>()
);

export const addTotalPriceToOrder = createAction(
  `[ORDER] AddTotalPrice Order `,
  props<{ totalPrice: number }>()
);
export const submitOrder = createAction(`[ORDER] Submit Order `);

export const submitOrderSuccess = createAction(
  `[ORDER] Submit Order Success`,
  props<{ order: IOrder }>()
);
export const getPreviousOrdersSuccess = createAction(
  `[ORDER] GetPrevious Order Success`,
  props<{ previousOrders: IOrder[] }>()
);

