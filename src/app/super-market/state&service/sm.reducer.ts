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

import { StateWithUser } from '@app/account/state&service/account.reducer';
import ICart from '@app/interfaces/cart.interface';
import ICategory from '@app/interfaces/category.interface';
import IOrder from '@app/interfaces/order.interface';
import IProduct from '@app/interfaces/product.interface';
import { cartReducer, loadingCartReducer } from './cart.reducer';
import {
  productsReducer,
  loadingProductsReducer,
  filteringProductsReducer,
  currentProductReducer,
  loadingCurrentProductReducer,
} from './product.reducer';
import {
  prevOrdersReducer,
  orderReducer,
  loadingOrderReducer,
} from './order.reducer';
import { categoryReducer } from './category.reducer';
export const superMarketFeatureKey = 'sm';
export interface StateWithSm extends StateWithUser {
  sm: SuperMarketState;
}

export interface SuperMarketState {
  cart: ICart;
  category: ICategory;
  products: { [key: string]: IProduct };
  currentProduct: IProduct;
  loadingCurrentProduct: boolean;
  order: IOrder;
  previousOrders: IOrder[];
  loadingCart: boolean;
  loadingProducts: boolean;
  loadingOrder: boolean;
  filteringProducts: boolean;
}

export const reducers: ActionReducerMap<SuperMarketState> = {
  cart: cartReducer,
  category: categoryReducer,
  products: productsReducer,
  currentProduct: currentProductReducer,
  loadingCurrentProduct: loadingCurrentProductReducer,
  order: orderReducer,
  previousOrders: prevOrdersReducer,
  loadingCart: loadingCartReducer,
  loadingProducts: loadingProductsReducer,
  loadingOrder: loadingOrderReducer,
  filteringProducts: filteringProductsReducer,
};

export const metaReducers: MetaReducer<SuperMarketState>[] =
  !environment.production ? [] : [];
