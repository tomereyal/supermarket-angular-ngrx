import {
  getCartSuccess,
  createCartSuccess,
  addCartItemSuccess,
  updateCartItemAmountSuccess,
  removeCartItemSuccess,
  emptyCart,
} from './cart.actions';
import {
  ActionReducer,
  ActionReducerMap,
  createFeatureSelector,
  createReducer,
  createSelector,
  MetaReducer,
} from '@ngrx/store';
import { on } from '@ngrx/store';
import { environment } from '../../../environments/environment';
import ICart from '@app/interfaces/cart.interface';
import { State } from '@app/reducers';
import ICartItem from '@app/interfaces/cartItem.interface';

export type IHashedCartItems = { [key: string]: ICartItem };
export type ICartWithHashedItems = Omit<ICart, 'cartItems'> & {
  cartItems: IHashedCartItems;
};
const initCart: ICart = {
  _id: '',
  customerRef: '',
  cartItems: {},
  createdAt: '',
};
export const cartReducer = createReducer(
  initCart,
  on(getCartSuccess, createCartSuccess, (state, { cart }) => {
    console.log(`cart gotten from server in reducer now`, cart);
    const cartItems = cart.cartItems.reduce(
      (prev: IHashedCartItems, cur: ICartItem) => {
        prev[cur.productRef._id] = cur;
        return prev;
      },
      {}
    );
    return { ...cart, cartItems };
  }),
  on(emptyCart, (state) => ({ ...state, cartItems: {} })),
  on(addCartItemSuccess, (state, { cartItem }) => {
    const cartItems = { ...state.cartItems };
    cartItems[cartItem.productRef._id] = cartItem;
    return { ...state, cartItems };
  }),
  on(updateCartItemAmountSuccess, (state, { productRef, amount }) => {
    // const cartItems = {
    //   ...state.cartItems,
    // };
    const cartItem = { ...state.cartItems[productRef] };
    cartItem.amount = amount;
    return {
      ...state,
      cartItems: { ...state.cartItems, [productRef]: cartItem },
    };
  }),
  on(removeCartItemSuccess, (state, { productRef }) => {
    const cartItems = { ...state.cartItems };
    console.log(`cartItems before`, cartItems);
    delete cartItems[productRef];
    console.log(`cartItems after`, cartItems);
    console.log(`new cart state`, { ...state, cartItems });
    return { ...state, cartItems };
  })
);

export const loadingCartReducer = createReducer(false);
