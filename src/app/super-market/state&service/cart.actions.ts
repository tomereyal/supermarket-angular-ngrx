import { createAction, props } from '@ngrx/store';
import ICart from '@app/interfaces/cart.interface';
import ICartItem from '@app/interfaces/cartItem.interface';

export const emptyCart = createAction('[CART] Empty Cart');

export const getCartSuccess = createAction(
  '[CART] Get Cart Success',
  props<{ cart: ICart }>()
);

export const createCart = createAction('[CART] Create Cart');

export const createCartSuccess = createAction(
  '[CART] Create Cart Success',
  props<{ cart: ICart }>()
);

export const addCartItem = createAction('[CART] AddCartItem Cart');

export const addCartItemSuccess = createAction(
  '[CART] AddCartItem Cart Success',
  props<{ cartItem: ICartItem }>()
);
export const updateCartItemAmount = createAction(
  '[CART] UpdateCartItemAmount Cart'
);

export const updateCartItemAmountSuccess = createAction(
  '[CART] UpdateCartItemAmount Cart Success',
  props<{ productRef: string; amount: number }>()
);
export const removeCartItem = createAction('[CART] RemoveCartItem Cart');

export const removeCartItemSuccess = createAction(
  '[CART] RemoveCartItem Cart Success',
  props<{ productRef: string }>()
);
