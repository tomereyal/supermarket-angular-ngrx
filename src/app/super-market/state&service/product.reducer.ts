import {
  createProduct,
  createProductFailure,
  createProductSuccess,
  getProductsByCategory,
  getProductsByCategorySuccess,
  getProductsByName,
  getProductsByNameSuccess,
  setCurrentProduct,
  updateProduct,
  updateProductFailure,
  updateProductSuccess,
} from './product.actions';
import { createReducer } from '@ngrx/store';
import IProduct from '@app/interfaces/product.interface';
import { on } from '@ngrx/store';

export type IHashedProducts = { [key: string]: IProduct };
const initProducts: IHashedProducts = {};
const initProduct: IProduct =
  {
    _id: '',
    name: '',
    price: 0,
    categoryRef: '',
    url: '',
  } || undefined;

export const productsReducer = createReducer(
  initProducts,
  on(
    getProductsByCategorySuccess,
    getProductsByNameSuccess,
    (state, { products }) =>
      products.reduce((prev: IHashedProducts, cur: IProduct) => {
        prev[cur._id] = cur;
        return prev;
      }, {})
  ),
  on(createProductSuccess, (state, { newProduct }) => ({
    ...state,
    [newProduct._id]: newProduct,
  })),
  on(updateProductSuccess, (state, { updatedProduct }) => ({
    ...state,
    [updatedProduct._id]: updatedProduct,
  }))
);
export const loadingProductsReducer = createReducer(
  false,
  on(getProductsByCategory, getProductsByName, () => true),
  on(getProductsByCategorySuccess, getProductsByNameSuccess, () => false)
);

export const filteringProductsReducer = createReducer(
  false,
  on(getProductsByName, () => true),
  on(getProductsByCategory, getProductsByCategorySuccess, () => false)
);

export const currentProductReducer = createReducer(
  initProduct || undefined,
  on(setCurrentProduct, (state, { product }) => product),
  on(createProductSuccess, (state, { newProduct }) => newProduct)
);
export const loadingCurrentProductReducer = createReducer(
  false,
  on(updateProduct, createProduct, () => true),
  on(
    updateProductSuccess,
    createProductSuccess,
    updateProductFailure,
    createProductFailure,
    () => false
  )
);
