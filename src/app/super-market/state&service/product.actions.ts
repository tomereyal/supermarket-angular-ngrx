import IProduct from '@app/interfaces/product.interface';
import { createAction, props } from '@ngrx/store';

export const getProductsByCategory = createAction(`[PRODUCT] GetByCategory`);
export const getProductsByCategorySuccess = createAction(
  `[PRODUCT] GetByCategory Success`,
  props<{ products: IProduct[] }>()
);
export const getProductsByName = createAction(`[PRODUCT] GetByName`);
export const getProductsByNameSuccess = createAction(
  `[PRODUCT] GetByName Success`,
  props<{ products: IProduct[] }>()
);

export const createProduct = createAction(`[PRODUCT create]`);

export const createProductSuccess = createAction(
  `[PRODUCT Create Success]`,
  props<{ newProduct: IProduct }>()
);
export const createProductFailure = createAction(`[PRODUCT Create Failure]`);
export const updateProductSuccess = createAction(
  `[PRODUCT Update Success]`,
  props<{ updatedProduct: IProduct }>()
);
export const updateProduct = createAction(`[PRODUCT Update]`);
export const updateProductFailure = createAction(`[PRODUCT Update Failure]`);

export const setCurrentProduct = createAction(
  `[PRODUCT SetCurrent]`,
  props<{ product: IProduct }>()
);
