import ICategory from '@app/interfaces/category.interface';
import { createReducer } from '@ngrx/store';
import IOrder from '@app/interfaces/order.interface';
import { on } from '@ngrx/store';
import { State } from '@app/reducers';

const initCategory: ICategory = { _id: '', name: '' };
export const categoryReducer = createReducer(initCategory);
